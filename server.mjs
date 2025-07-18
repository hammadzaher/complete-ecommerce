import express from 'express';
import { db } from './db.mjs'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'



const app = express();

const PORT = 3001;

app.use(cors({
    origin: ["*"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const SECRET = process.env.SECRET_TOKEN;

// app.get('/', async (req, res) => {
//     // console.log("Hello world")
//     // res.send("Hello Hammad zaheer")
//     try {
//         const result = await db.query(`SELECT * FROM users;`)
//         res.status(200).send({ message: "Success", data: result.rows, result: result })
//     } catch (error) {
//         res.status(400).send({ message: "Internal server error" })
//     }
// })


// User Signup Api
app.post('/api/v1/sign_up', async (req, res) => {
    let reqBody = req.body;
    if (!reqBody.first_name || !reqBody.last_name || !reqBody.email || !reqBody.password) {
        res.status(400).send({ message: "Required perameter missing" })
        return;
    }
    reqBody.email = reqBody.email.toLowerCase();
    let query = `SELECT * FROM users WHERE email = $1`
    let values = [reqBody.email]
    try {
        let result = await db.query(query, values);
        if (result.rows?.length) {
            res.status(400).send({ message: "User Already Access With This Email" });
            return;
        }

        let addQuery = `INSERT INTO users(first_name , last_name , email , password) VALUES ($1 , $2 , $3 , $4)`
        const hash = bcrypt.hashSync(reqBody.password.toString(), 10);

        let addValues = [reqBody.first_name, reqBody.last_name, reqBody.email, hash]
        let addUser = await db.query(addQuery, addValues)

        res.status(201).send({ message: "User Created" })
        return;

    } catch (error) {
        res.status(500).send({ message: "Internl server error" })
        console.log(error);
    }
})


app.post('/api/v1/login', async (req, res) => {
    const reqBody = req.body;

    if (!reqBody.email || !reqBody.password) {
        res.status(400).send({ message: "Required parameter missing" });
        return;
    }

    reqBody.email = reqBody.email.toLowerCase();

    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [reqBody.email];

    try {
        const result = await db.query(query, values);

        // ✅ Check if user exists
        if (result.rows.length === 0) {
            res.status(401).send({ message: "User does not exist with this email" });
            return;
        }

        const user = result.rows[0];

        // ✅ Compare hashed password
        const isMatched = await bcrypt.compare(reqBody.password.toString(), user.password);

        if (!isMatched) {
            res.status(401).send({ message: "Password did not match" });
            return;
        }

        // User Login Token Generted;
        let token = jwt.sign({
            id: user.user_id,
            firstName: user.first_name,
            lastName: user.first_name,
            email: user.email,
            user_role: user.user_role,
            iat: Date.now() / 1000,
            exp: (Date.now() / 1000) + (1000 * 60 * 60 * 24)
        }, SECRET);

        //User Login Set Cookie;
        res.cookie('Token', token, {
            maxAge: 8640000,
            httpOnly: true,
            secure: true,
        });

        // User Login respone send
        res.status(200)
        res.send({
            message: "User Logged In",
            user: {
                user_id: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                user_role: user.user_role,
                profile: user.profile
            }
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).send({ message: "Internal server error" });
    }
});






///////////////////////////////////////////////////////////////////
app.get('/api/v1/logout', (req, res) => {
    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true,
        // sameSite: "none",
        secure: true
    });
    res.status(200).send({ message: "User Logout" })
})



///////////////////////////////////////////////////////////////////
app.use('/api/v1/*splat', (req, res, next) => {
    // console.log("req?.cookies?.Token" , req?.cookies?.Token);
    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "Unauthorized"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
        if (!err) {

            // console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    secure: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");
                req.body = {
                    ...req.body,
                    token: decodedData
                }
                next();
            }
        } else {
            res.status(401).send({ message: "invalid token" })
        }
    });
})




/////////////////////////////////////////////////////////////////
app.get('/api/v1/profile', async (req, res) => {
    const userId = req.body.token?.id;

    try {
        const result = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, user_role, profile FROM users WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        const user = result.rows[0];

        res.status(200).send({
            message: "User Found",
            user
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



/////////////////////////////////////////////////////////////////
app.get('/api/v1/user-detail', async (req, res) => {
    let userToken = req.body.token;
    let query = `SELECT * FROM users WHERE user_id = $1`;
    let value = [userToken.id]
    try {
        let result = await db.query(query, value)
        res.status(200).send({
            message: "User Found", user: {
                user_id: result.rows[0].user_id,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                user_role: result.rows[0].user_role,
                profile: result.rows[0].profile,
            }
        })
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({ message: "Internal Server Error" })
    }
})



///////////////////////////////////////////////////////////////////


app.get('/api/v1/products', async (req, res) => {
    try {
        let result = await db.query(`
            SELECT 
                p.product_id, p.product_name, p.price, p.product_image, 
                p.description, p.created_at, c.category_name
            FROM product AS p 
            LEFT JOIN categories AS c 
            ON p.category_id = c.catergory_id
        `);

        console.log("Fetched products:", result.rows);
        res.status(200).send({ message: "Product found", products: result.rows });
    } catch (error) {
        console.log("DB Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

///////////////////////////////////////////////////////////////////
app.get('/api/v1/category', async (req, res) => {
    try {
        let result = await db.query(`SELECT * FROM categories`);
        res.status(200).send({ message: "Category found", products: result.rows })
    } catch (error) {
        res.status(400).send({ message: " Internal servere error" })
    }
})


app.use('/api/v1/*splat', (req, res, next) => {
    if (req.body.token.user_role != 1) {
        res.status(401).send({
            message: "Unauthorized"
        })
        return;
    } else {
        next();
    }
})



app.post('/api/v1/products', async (req, res) => {
    const { name, price, description, category_id, image } = req.body;

    if (!name || !price || !description || !category_id || !image) {
        return res.status(400).send({ message: "Required Parameter Missing" });
    }

    try {
        const query = `
            INSERT INTO product (product_name, price, description, product_image, category_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [name, price, description, image, category_id];

        await db.query(query, values);

        res.status(201).send({ message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});



app.post('/api/v1/catgories', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).send({ message: "Required Parameter Missing" });
    }

    try {
        const query = `
            INSERT INTO categories(category_name , description)
            VALUES ($1, $2)
        `;
        const values = [name, description];
        await db.query(query, values);

        res.status(201).send({ message: "Category Added" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});


// this api connect with firntend and backend
const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('/*splat', express.static(path.join(__dirname, './web/build')))



app.listen(PORT, () => {
    console.log("seerver is runing")
})

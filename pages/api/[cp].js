import clientPromise from "@/lib/mongodb";
import app from "@/lib/firebase";

// import { ObjectId } from "mongodb";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    // createUserWithEmailAndPassword,
    // signOut,
    // sendEmailVerification,
    // updateProfile
} from "firebase/auth";
 import admin from '@/lib/fireAdmin';
// import credentials from './../../credentials.json'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

console.log('**************************************')

export function John(req, res) {
    res.status(200).json({ name: 'John Doe' })
}

async function ValidateNewUser(email, password, db, col_name) {
    const auth = getAuth(app);
    // console.log(">>> ",auth)
    signInWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
            // console.log(">>> ", Object.keys(user));
            if (user.uid && user.email && user.emailVerified) {
                let myUpdate2 = await db.collection('User' + col_name)
                    .insertOne(
                        {
                            email,
                            tokens: []
                        }
                    );
                if (myUpdate2.insertedId) {
                    signOut(auth).then(res => res, err => err);
                }
            }
            return "No operation"
        }, err => {
            console.log(">>> ", err);
            return "No operation"
        })
}

async function TokenValidator(idToken,email=''){
    let isValidUser=false;
    try{
        await admin.auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          //JSON.stringify(decodedToken,null,2),
          // ...
          console.log('>>> ',uid, 
          decodedToken.email,email)
          if(email===decodedToken.email){
            isValidUser= true;
          }
        })
        .catch((error) => {
          // Handle error
          console.log('>>> ',error)
        });
    }
    catch(err){

    }
    return isValidUser;
}


export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("CompPro");
    const col_name = 'BabbarSheet'
    //const auth= getAuth(app);
    // console.log(auth)
    let bodyObject = req?.body
    //console.log('GET PROB')
    let result = 'Bad Request', tokenExists;
    const { cp } = req.query
    console.log(cp, req.query.email)
    switch (cp) {
        case 'get_prob':
            if (req.method !== 'GET') res.json('Not Valid')
            result = await db.collection(col_name).aggregate(
                [
                    { "$sample": { "size": 3 } },
                    // { $limit: 3 },
                    {
                        $lookup: {
                            from: "Solved" + col_name,
                            let: { foreignId: { $toString: "$_id" } },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        email: req.query.email
                                        // email:'ishtiyaque4755@gmail.com'
                                    }
                                },
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$id", "$$foreignId"]
                                        }
                                    }
                                }
                            ],
                            as: "joins"
                        }
                    }, {
                        $project: {
                            _id: 1, Topic: 1, Prob: 1, Link: 1, Rating: 1,
                            status: "$joins.status"
                        }
                    },
                    // { $unwind: "$status" } // will remove empty status
                ]).toArray();
            res.json(result)
            return;
        case 'get_prob_cnt':
            if (req.method !== 'GET') res.json('Not Valid')
            result = await db.collection(col_name).aggregate(
                [
                    {
                        $count: "prob_cnt"
                    },
                ]
            ).toArray();
            // console.log(result)
            res.json(result)
            return;
        case 'get_solved_cnt':
            if (req.method !== 'GET' | req.query.email === null) res.json('Not Valid')
            // let myUpdate4;
            tokenExists = await db.collection('User' + col_name).findOne({ email: req.query.email, tokens: req.query.token });
            if (tokenExists) {
                result = await db.collection('Solved' + col_name).aggregate(
                    [
                        {
                            $match: {
                                email: req.query.email
                                // email: 'ishtiyaque4755@gmail.com'
                            }
                        },
                        {
                            $count: "solved_cnt"
                        },
                    ]
                ).toArray();
            }
            // let p=result.count()
            else { console.log("User Not loggedin") }
            console.log(result)
            res.json(result)
            return;
        case 'update_solved':
            if (req.method !== 'PATCH') res.json('Not Valid')
            bodyObject = req.body;
            const { id, email, token, status } = bodyObject.data;
            // console.log(">>>Hello Update", id, email, status)
            let myUpdate4;
            tokenExists = await db.collection('User' + col_name).findOne({ email: email, tokens: token });
            if (tokenExists) {
                myUpdate4 = await db.collection('Solved' + col_name).updateOne(
                    { email, id },
                    {
                        $set: {
                            status
                        }
                    },
                    {
                        upsert: true
                    }
                )
            }
            else { console.log("User Not loggedin") }
            // console.log(myUpdate4)
            res.json(myUpdate4)
            return;
        case 'set_login_token':
            if (req.method !== 'POST') res.json('Not Valid')
            //console.log(bodyObject.data.email, bodyObject.data.token)
            let myUpdate2 = await db.collection('User' + col_name).updateOne(
                { email: bodyObject.data.email },
                {
                    $push: { "tokens": bodyObject.data.token },
                    $currentDate: { lastModified: true }
                }
                // ,{ upsert: true } // if user exist then set token
            );

            res.json(myUpdate2)
            return
        case 'remove_login_token':
            if (req.method !== 'POST') res.json('Not Valid')
            //console.log(bodyObject.data.email, bodyObject.data.token)
            let myUpdate3 = await db.collection('User' + col_name).updateOne(
                { email: bodyObject.data.email },
                {
                    $pull: { "tokens": bodyObject.data.token },
                }
            );
            res.json(myUpdate3)
            return
        case 'set_new_user':
            if (req.method !== 'POST') res.json('Not Valid')
            let userStatus = await ValidateNewUser(bodyObject.data.email, bodyObject.data.password, db, col_name);
            //res.json(userStatus)
            console.log(userStatus)
            res.json(userStatus)
            return;
        case 'test':
            const isValidUser=await TokenValidator(bodyObject.data.idToken,bodyObject.data.email);
            console.log("Is valid user ",isValidUser)
            res.json({ Test: 1, text: 'Hello Hello Hello... CCC',isValidUser })
            return;
    }

    res.json('No One Responded!')
    // switch (req.method) {
    //     case "POST":
    //         bodyObject = JSON.parse(req.body);
    //         // res.json(myPost.ops[0]);
    //         switch (bodyObject.type) {
    //             case 'ADD_SENCE':
    //                 // console.log('ADD_SENCE>>>',bodyObject)
    //                 let myPost = await db.collection(col_name).insertOne(bodyObject.sence);
    //                 res.json(myPost)
    //                 return;
    //         }
    //         res.json("Not Posted")
    //         break;
}

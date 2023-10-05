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
import admin from "@/lib/fireAdmin";
import { getApp } from "firebase-admin/app";
// import credentials from './../../credentials.json'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

console.log("**************************************");

export function John(req, res) {
  res.status(200).json({ name: "John Doe" });
}
// this is working perfect but we can verify new user by idToken i.e using TokenValidator function
async function ValidateNewUser(email, password, db, col_name) {
  const auth = getAuth(app);
  // console.log(">>> ",auth)
  signInWithEmailAndPassword(auth, email, password).then(
    async ({ user }) => {
      // console.log(">>> ", Object.keys(user));
      if (user.uid && user.email && user.emailVerified) {
        let myUpdate2 = await db.collection("User" + col_name).insertOne({
          email,
          tokens: [],
        });
        if (myUpdate2.insertedId) {
          signOut(auth).then(
            (res) => res,
            (err) => err
          );
        }
      }
      return "No operation";
    },
    (err) => {
      console.log(">>> ", err);
      return "No operation";
    }
  );
}
// it verify user token using admin level previledge
async function TokenValidator(idToken, email = "") {
  let isValidUser = false;
  try {
    if (idToken)
      await getApp("adminApp")
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          //JSON.stringify(decodedToken,null,2),
          // ...
          // console.log('>>> ', uid,decodedToken.email, email)
          if (email === decodedToken.email) {
            isValidUser = true;
          }
        })
        .catch((error) => {
          // Handle error
          console.log(">>> ", error);
        });
  } catch (err) {
    console.log("Something goese wrong!");
  }
  return isValidUser;
}

export default async function handler(req, res) {
  const { cp } = req.query;
  try {
    const client = await clientPromise;
    console.log("Suc: MongoDB connected!!!");
    const db = client.db("CompPro");
    const col_name = "BabbarSheet";
    //const auth= getAuth(app);
    // console.log(auth)
    let bodyObject = req?.body;
    //console.log('GET PROB')
    let result = "Bad Request",
      tokenExists;
    console.log(cp, req.query.email);
    switch (cp) {
      case "get_prob": {
        if (req.method !== "GET") res.json("Not Valid");
        const { email } = req.query;
        result = await db
          .collection(col_name)
          .aggregate([
            { $sample: { size: 3 } },
            // { $limit: 3 },
            {
              $lookup: {
                from: "Solved" + col_name,
                let: { foreignId: { $toString: "$_id" } },
                pipeline: [
                  {
                    $match: {
                      email,
                      // if email present status will show
                      // otherwise problem show irrespective of status
                      // email:'ishtiyaque4755@gmail.com'
                    },
                  },
                  {
                    $match: {
                      $expr: {
                        $eq: ["$id", "$$foreignId"],
                      },
                    },
                  },
                ],
                as: "joins",
              },
            },
            {
              $project: {
                _id: 1,
                Topic: 1,
                Prob: 1,
                Link: 1,
                Rating: 1,
                status: "$joins.status",
              },
            },
            // { $unwind: "$status" } // will remove empty status
          ])
          .toArray();
        res.json(result);
        return;
      }
      case "get_prob_cnt":
        if (req.method !== "GET") res.json("Not Valid");
        result = await db
          .collection(col_name)
          .aggregate([
            {
              $count: "prob_cnt",
            },
          ])
          .toArray();
        // console.log(result)
        res.json(result);
        return;
      case "get_solved_cnt": {
        if ((req.method !== "GET") | (req.query.email === null))
          res.json("Not Valid");
        // let myUpdate4;
        // tokenExists = await db.collection('User' + col_name).findOne({ email: req.query.email, tokens: req.query.token });
        const { email, token } = req.query;
        const isValidToken1 = await TokenValidator(token, email);
        if (isValidToken1) {
          result = await db
            .collection("Solved" + col_name)
            .aggregate([
              {
                $match: {
                  email,
                  // email: 'ishtiyaque4755@gmail.com'
                },
              },
              {
                $count: "solved_cnt",
              },
            ])
            .toArray();
          res.json(result);
        }
        // let p=result.count()
        else {
          //console.log("User Not loggedin")
          res.status(401).json({ message: "User Not loggedin!" });
        }
        // console.log(result)
        return;
      }
      case "update_solved": {
        if (req.method !== "PATCH") res.json("Not Valid");
        bodyObject = req.body;
        const { id, email, token, status } = bodyObject.data;
        // console.log(">>>Hello Update", id, email, status)
        // let myUpdate4;
        // tokenExists = await db.collection('User' + col_name).findOne({ email: email, tokens: token });
        const isValidToken2 = await TokenValidator(token, email);
        if (isValidToken2) {
          result = await db.collection("Solved" + col_name).updateOne(
            { email, id },
            {
              $set: {
                status,
              },
            },
            {
              upsert: true,
            }
          );
          res.json(result);
        } else {
          //console.log("User Not loggedin")
          res.status(401).json({ message: "User Not loggedin!" });
        }
        // console.log(myUpdate4)
        return;
      }
      case "set_login_token":
        if (req.method !== "POST") res.json("Not Valid");
        //console.log(bodyObject.data.email, bodyObject.data.token)
        // let myUpdate2 = await db.collection('User' + col_name).updateOne(
        //     { email: bodyObject.data.email },
        //     {
        //         $push: { "tokens": bodyObject.data.token },
        //         $currentDate: { lastModified: true }
        //     }
        // );

        // res.json(myUpdate2)
        res.json({ message: "May no use of this API" });

        return;
      case "remove_login_token":
        if (req.method !== "POST") res.json("Not Valid");
        //console.log(bodyObject.data.email, bodyObject.data.token)
        // let myUpdate3 = await db.collection('User' + col_name).updateOne(
        //     { email: bodyObject.data.email },
        //     {
        //         $pull: { "tokens": bodyObject.data.token },
        //     }
        // );
        // res.json(myUpdate3)
        res.json({ message: "May no use of this API" });
        return;
      case "set_new_user": {
        if (req.method !== "POST") res.json("Not Valid");
        // let userStatus = await ValidateNewUser(bodyObject.data.email, bodyObject.data.password, db, col_name);
        //res.json(userStatus)
        const { email, token } = bodyObject.data;
        const isValidUser1 = await TokenValidator(token, email);
        if (isValidUser1) {
          let userStatus = await db.collection("User" + col_name).insertOne({
            email,
            tokens: [],
          });
          if (userStatus.insertedId) {
            console.log("User Added!");
          }
          console.log(userStatus);
          res.json(userStatus);
        } else res.status(500).json({ message: "Something goes wrong!" });
        return;
      }
      case "test":
        const isValidUser = await TokenValidator(
          bodyObject.data.idToken,
          bodyObject.data.email
        );
        console.log("Is valid user ", isValidUser);
        let userStatus2 = await ValidateNewUser(
          "maishtiyaque@gmail.com",
          "123456",
          db,
          col_name
        );
        console.log("userStatus ", userStatus2);
        res.json({ Test: 1, text: "Hello Hello Hello... CCC", isValidUser });
        return;
    }
    res.status(500).json({ message: "No Response!" });
  } catch (err) {
    console.log("Err: MongoDB NOT connected!!!");
    res.status(500).json({ message: "No Response!..." });
  }
}

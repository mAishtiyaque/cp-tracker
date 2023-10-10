import clientPromise from "@/lib/mongodb";
import admin from "@/lib/fireAdmin";
import { getApp } from "firebase-admin/app";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

//console.log("**************************************");

export function John(req, res) {
  res.status(200).json({ name: "John Doe" });
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
        const { email, token } = req.query;
        const isValidToken1 = await TokenValidator(token, email);
        if (isValidToken1) {
          result = await db
            .collection("Solved" + col_name)
            .aggregate([
              {
                $match: {
                  email,
                  status:true
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
      case "set_new_user": {
        if (req.method !== "POST") res.json("Not Valid");
        //res.json(userStatus)
        const { email, token } = bodyObject.data;
        const isValidUser1 = await TokenValidator(token, email);
        if (isValidUser1) {
          let userStatus = await db.collection("User" + col_name).insertOne({
            email
          });
          if (userStatus.insertedId) {
            console.log("User Added!");
          }
          // console.log(userStatus);
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
        res.json({ Test: 1, text: "Hello Hello Hello... CCC", isValidUser });
        return;
    }
    res.status(500).json({ message: "No Response!" });
  } catch (err) {
    console.log("Err: MongoDB NOT connected!!!");
    res.status(500).json({ message: "No Response!..." });
  }
}

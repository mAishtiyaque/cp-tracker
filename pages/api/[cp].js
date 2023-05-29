import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export function John(req, res) {
    res.status(200).json({ name: 'John Doe' })
}

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("CompPro");
    const col_name = 'BabbarSheet'
    let bodyObject = req?.body
    //console.log('GET PROB')
    let result;
    const { cp } = req.query
    switch (cp) {
        case 'get_prob':
            if (req.method !== 'GET') res.json('Not Valid')
            result = await db
                .collection(col_name)
                .aggregate([{ "$sample": { "size": 3 } }])
                //.aggregate([{ $skip: 1 }, { $limit: 3 }])
                .toArray();
            res.json({ status: 200, data: result });
            return;
        case 'get_prob_cnt':
            if (req.method !== 'GET') res.json('Not Valid')
            result = await db
                .collection(col_name)
                .aggregate([{ $count: "total_prob" }])
                .toArray()
            res.json(result)
            return;
        case 'get_solved_cnt':
            if (req.method !== 'GET') res.json('Not Valid')
            result = await db.collection(col_name).aggregate(
                [

                    {
                        $match: {
                            Solved:{
                                $eq:true
                            }
                        }
                    },
                    {
                        $count: "solved_cnt"
                    },
                ]
            ).toArray()
            //console.log(result)
            res.json(result)
            return;
        case 'update_solved':
            if (req.method !== 'PATCH') res.json('Not Valid')
            bodyObject = req.body;
            //console.log(">>>Hello Update", bodyObject)
            let myUpdate = await db.collection(col_name).updateOne(
                { _id: new ObjectId(bodyObject.id) },
                {
                    $set: { Solved: bodyObject.Solved },
                    $currentDate: { lastModified: true }
                }
            );
            res.json(myUpdate)
            return;

        case 'test':
            res.json({Test:1,text:'Hello Hello Hello... CCC'})
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

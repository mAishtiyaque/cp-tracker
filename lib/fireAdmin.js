import * as admin from 'firebase-admin'
//import 'firebase/auth';
if(!admin.apps.length)
admin.initializeApp({
    credential:admin.credential.cert(
      { 
        project_id:process.env.project_id,
        private_key:process.env.private_key,
        client_email:process.env.client_email
      }
      )
},'adminApp')
// let app;
//console.log(credentials)
// if (!getApps().length) {
//   app = initializeApp({
//     credential:credential.cert(credentials)
//   },'adminApp');
// } else {
//   app = getApps('adminApp');
// }
  export default admin;
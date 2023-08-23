import * as admin from 'firebase-admin'
//import 'firebase/auth';
import credentials from './../credentials.json'
if(!admin.apps.length)
admin.initializeApp({
    credential:admin.credential.cert(credentials)
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
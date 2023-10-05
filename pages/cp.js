import styles from '@/styles/ListView.module.css'

import { useEffect, useRef, useState, useContext } from 'react'
import { useAuth } from '@/lib/AuthUserContext';
import axios from 'axios';
import Image from 'next/image';
export default function Listview({ alertMe }) {
  const technique = [
    'Recursive approach',
    'Iterative approach',
    'Tabular form DP',
    'Memoization  technique',
    '2 pointer approach',
    '3 Pointer approach',
    'Previuous Value Storing [Linear, 2D]'
  ]
  const [preProb, setPreProb] = useState([])
  const [probData, setProbData] = useState([]);
  const [probMeta, setProbMeta] = useState({});
  const auth = useAuth();
  const getProb = async () => {
    axios.get('api/get_prob', {
      params: {
        email: auth?.email
      }
    })
      .then(resp => {
        // console.log(resp.data)
        if (probData.length)
          setPreProb(item => [{ active: false, prob: probData }, ...item])
        setProbData(() => resp.data)
      }).catch(err => console.log('Err: ', err))
  }
  const getProbCnt = async () => {
    axios.get('api/get_prob_cnt')
      .then(res => res.data)
      .then(data => {
        // console.log(data)
        setProbMeta(item => { return { ...item, ...data[0] } })
      })
      .catch(error => console.error('Err: ', error));
  }
  const getSolvedCnt = async () => {
    axios.get('api/get_solved_cnt', {
      params: {
        token: auth?.token,
        email: auth?.email
      }
    })
      .then(res => res.data)
      .then(data => {
        //console.log(data)
        setProbMeta(item => { return { ...item, ...data[0] } })
      })
      .catch(err => console.error("Err: ",err));
  }
  useEffect(() => {
    getProb()
    getProbCnt()
  }, [])

  useEffect(() => {
    if (auth.email) {
      getSolvedCnt()
      // getProb()
    }
    //console.log(auth)
  }, [auth?.email])
  const TestFunc = (token) => {
    axios.post('api/test', {
      data: {
        idToken: auth?.token,
        email: auth?.email
      }
    }).then((res) => console.log(res), (err) => console.log(err))
  }
  return (
    <div>
    // auth.setExe('Hello World'+new Date().getTime()),1000)
      {/* <button onClick={() => setInterval(()=>TestFunc('hello'),4000)}>TEST Token</button> */}
      <button onClick={() => TestFunc('hello')}>TEST Token</button>
      {/* {JSON.stringify(auth)}*/} <br />
      {auth?.name} <br />
      {auth?.email} <br />
      {auth?.emailVerified ?
        <> Verified
          {/* <svg viewBox="0 0 22 22" aria-label="Verified account"  role="img" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr" data-testid="icon-verified"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg> */}
          <svg stroke="currentColor" fill="#7d6cf0" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path></svg>      </>
        : "Anonmous"} <br />
      {/* {auth?.photoURL} <br /> */}
      <img src={auth?.photoURL} alt="" />
      <pre>
        {JSON.stringify(auth, null, '   ')}
      </pre>
      <div className={styles.listViewWrapper} >
        <div className={styles.range}>
          <span><span style={{ width: `${probMeta.solved_cnt * 100 / probMeta.prob_cnt}%` }}></span></span>
          <span>{probMeta.solved_cnt}/{probMeta.prob_cnt}</span>
        </div>
        {
          probData?.map((item, idx) =>
            <SenceRow senceDetails={item} alertMe={alertMe} key={item._id} />
          )
        }
      </div>
      <div>
        <button onClick={() => getProb()}> Refresh &#x21BA;</button>
      </div>
      <div className={[styles.listViewWrapper, styles.preLVW].join(" ")}>
        {
          preProb?.map((item, idx) =>
            <ToggleGr prob={item} alertMe={alertMe} key={idx + item.prob[0]._id} idx={idx} />
          )
        }
        <div>
          <ol>
            {
              technique.map((item, idx) =>
                <li key={idx}>{item}</li>
              )}
          </ol>
        </div>
        <br /> <br /> <br />
      </div>
    </div>
  )
}
function ToggleGr({ prob, alertMe, idx }) {
  const [active, setActive] = useState(prob.active)
  return (
    <div className={styles.toggleGr}>
      {/* {JSON.stringify(prob)} */}

      <div className={styles.preHead}>
        <div>{prob.prob[0].Topic}
          <span style={{ fontWeight: 400 }}> | </span> {prob.prob[1].Topic} <span style={{ fontWeight: 400 }}> | </span> {prob.prob[2].Topic}
        </div>
        <button
          onClick={() => setActive(item => !item)}
          style={active ? {} : { transform: 'rotate(180deg)' }}
        >
          &#x2657;
        </button>
      </div>
      {
        active &&
        <>{
          prob.prob?.map((item, idx2) =>
            <SenceRow senceDetails={item} alertMe={alertMe} key={item._id + idx + idx2} />
          )}
        </>
      }
    </div>
  )
}

function SenceRow({ senceDetails, alertMe }) {
  const auth = useAuth();
  const updateSolved = (id, status) => {
    axios.patch('api/update_solved', {
      data: {
        id,
        email: auth?.email,
        token: auth?.token,
        status
      }
    }).then(res => {
      (res.data.acknowledged) ? alertMe('Updated Solved!', 'success') : null // success
    }).catch(err => {
      alertMe('Something going wrong') // failure
    })
  }
  useEffect(() => {
    //console.log("SENCES ", senceDetails.status[0])
  }, [])
  const [isSolved, setIsSolved] = useState(senceDetails.status[0]);
  const handleSolved = () => {
    // console.log('handleSolved')
    setIsSolved((item) => {
      updateSolved(senceDetails._id, !item);
      return !item;
    })
  }
  return (
    <div className={styles.listRow} >
      <div>{senceDetails.Topic}</div>
      <div>
        <input onClick={handleSolved} type='checkbox' defaultChecked={isSolved} />
      </div>
      <div><a href={senceDetails.Link} target='_blank'>{senceDetails.Prob}</a></div>
      <div className={styles.rating}>{senceDetails.Rating}</div>
    </div>
  )
}


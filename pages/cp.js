import styles from '@/styles/ListView.module.css'

import { useEffect, useRef, useState } from 'react'

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
  const getProb = async () => {
    fetch('api/get_prob')
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        if (probData.length)
          setPreProb(item => [{ active: false, prob: probData }, ...item])
        // else
        //   setPreProb(item => [{ active: false, prob: data?.data }, ...item])
        setProbData(data?.data)
      })
      .catch(error => console.error(error));
  }
  const getProbCnt = async () => {
    fetch('api/get_prob_cnt')
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        setProbMeta(item => { return { ...item, ...data[0] } })
      })
      .catch(error => console.error(error));
  }
  const getSolvedCnt = async () => {
    fetch('api/get_solved_cnt')
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        setProbMeta(item => { return { ...item, ...data[0] } })
      })
      .catch(error => console.error(error));
  }
  useEffect(() => {
    getProb()
    getProbCnt()
    getSolvedCnt()
  }, [])
  return (
    <div>
      <div className={styles.listViewWrapper} >
        <div className={styles.range}>
          <span><span style={{ width: `${probMeta.solved_cnt * 100 / probMeta.total_prob}%` }}></span></span>
          <span>{probMeta.solved_cnt}/{probMeta.total_prob}</span>

        </div>
        {
          probData?.map((item, idx) =>
            <SenceRow senceDetails={item} alertMe={alertMe} key={idx} />
          )
        }
      </div>
      <div>
        <button onClick={() => getProb()}> Refresh &#x21BA;</button>
      </div>
      <div className={[styles.listViewWrapper, styles.preLVW].join(" ")}>
        {
          preProb?.map((item, idx) =>
            <ToggleGr prob={item} alertMe={alertMe} key={idx} />
          )
        }
        <div>
          <ol>
          {
            technique.map((item,idx)=>
            <li key={idx}>{item}</li>
            )}
            </ol>
        </div>
            <br /> <br /> <br />
      </div>
    </div>
  )
}
function ToggleGr({ prob, alertMe }) {
  const [active, setActive] = useState(prob.active)
  return (
    <div className={styles.toggleGr}>
      {/* {JSON.stringify(prob)} */}

      <div className={styles.preHead}>
        <div>{prob.prob[0].Topic} <span style={{fontWeight:400}}> | </span> {prob.prob[1].Topic} <span style={{fontWeight:400}}> | </span> {prob.prob[2].Topic}
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
        <>
          <SenceRow senceDetails={prob.prob[0]} alertMe={alertMe} />
          <SenceRow senceDetails={prob.prob[1]} alertMe={alertMe} />
          <SenceRow senceDetails={prob.prob[2]} alertMe={alertMe} />
        </>
      }
    </div>
  )
}

function SenceRow({ senceDetails, alertMe }) {
  const updateSolved = (id, Solved) => {
    //console.log('Hello Update')
    fetch('api/update_solved', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'UPDATE_SOLVED', id, Solved })
    })
      .then(res => res.json())
      .then(data => {
        if (data.acknowledged)
          alertMe('Updated Solved!', 'success') // success
        else
          alertMe('Something going wrong') // failure
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    //console.log("SENCES ", senceDetails)
  }, [])
  const [isSolved, setIsSolved] = useState(senceDetails.Solved);
  const handleSolved = () => {
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


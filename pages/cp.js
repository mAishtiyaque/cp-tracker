import styles from "@/styles/ListView.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "@/lib/AuthUserContext";
import axios from "axios";
export default function Listview({ alertMe }) {
  const technique = [
    "Recursive approach",
    "Iterative approach",
    "Tabular form DP",
    "Memoization  technique",
    "2 pointer approach",
    "3 Pointer approach",
    "Previuous Value Storing [Linear, 2D]",
  ];
  const [preProb, setPreProb] = useState([]);
  const [probData, setProbData] = useState([]);
  const [probMeta, setProbMeta] = useState({});
  const auth = useAuth();
  const getProb = async () => {
    axios
      .get("api/get_prob", {
        params: {
          email: auth?.email,
        },
      })
      .then((resp) => {
        // console.log(resp.data)
        if (probData.length)
          setPreProb((item) => [{ active: false, prob: probData }, ...item]);
        setProbData(() => resp.data);
      })
      .catch((err) => console.log("Err: ", err));
  };
  const getProbCnt = async () => {
    axios
      .get("api/get_prob_cnt")
      .then((res) => res.data)
      .then((data) => {
        // console.log(data)
        setProbMeta((item) => {
          return { ...item, ...data[0] };
        });
      })
      .catch((error) => console.error("Err: ", error));
  };
  const getSolvedCnt = async () => {
    axios
      .get("api/get_solved_cnt", {
        params: {
          token: auth?.token,
          email: auth?.email,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        //console.log(data)
        setProbMeta((item) => {
          return { ...item, ...data[0] };
        });
      })
      .catch((err) => console.error("Err: ", err));
  };
  useEffect(() => {
    getProb();
    getProbCnt();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (auth.email) {
      getSolvedCnt();
      // getProb()
    }
    //console.log(auth)
    // eslint-disable-next-line
  }, [auth?.email]);
  const TestFunc = (token) => {
    axios
      .post("api/test", {
        data: {
          idToken: auth?.token,
          email: auth?.email,
        },
      })
      .then(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  };
  return (
    <div>
      {/* <button onClick={() => setInterval(()=>TestFunc('hello'),4000)}>TEST Token</button> */}
      {/* <button onClick={() => TestFunc("hello")}>TEST Token</button> */}
      <br />
      {/* <pre>{JSON.stringify(auth, null, "   ")}</pre> */}
      <div className={styles.listViewWrapper}>
        <div className={styles.range}>
          <span>
            <span
              style={{
                width: `${(probMeta.solved_cnt * 100) / probMeta.prob_cnt}%`,
              }}
            ></span>
          </span>
          <span>
            {probMeta.solved_cnt}/{probMeta.prob_cnt}
          </span>
        </div>
        {probData?.map((item, idx) => (
          <SenceRow senceDetails={item} alertMe={alertMe} key={item._id} />
        ))}
      </div>
      <div>
        <button onClick={() => getProb()}> Refresh &#x21BA;</button>
      </div>
      <div className={[styles.listViewWrapper, styles.preLVW].join(" ")}>
        {preProb?.map((item, idx) => (
          <ToggleGr
            prob={item}
            alertMe={alertMe}
            key={idx + item.prob[0]._id}
            idx={idx}
          />
        ))}
        <div>
          <ol>
            {technique.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
        <br /> <br /> <br />
      </div>
    </div>
  );
}
function ToggleGr({ prob, alertMe, idx }) {
  const [active, setActive] = useState(prob.active);
  return (
    <div className={styles.toggleGr}>
      {/* {JSON.stringify(prob)} */}

      <div className={styles.preHead}>
        <div>
          {prob.prob[0].Topic}
          <span style={{ fontWeight: 400 }}> | </span> {prob.prob[1].Topic}{" "}
          <span style={{ fontWeight: 400 }}> | </span> {prob.prob[2].Topic}
        </div>
        <button
          onClick={() => setActive((item) => !item)}
          style={active ? {} : { transform: "rotate(180deg)" }}
        >
          &#x2657;
        </button>
      </div>
      {active && (
        <>
          {prob.prob?.map((item, idx2) => (
            <SenceRow
              senceDetails={item}
              alertMe={alertMe}
              key={item._id + idx + idx2}
            />
          ))}
        </>
      )}
    </div>
  );
}

function SenceRow({ senceDetails, alertMe }) {
  const auth = useAuth();
  const updateSolved = (id, status) => {
    axios
      .patch("api/update_solved", {
        data: {
          id,
          email: auth?.email,
          token: auth?.token,
          status,
        },
      })
      .then((res) => {
        res.data.acknowledged ? alertMe("Updated Solved!", "success") : null; // success
      })
      .catch((err) => {
        alertMe("Something going wrong"); // failure
      });
  };
  useEffect(() => {
    //console.log("SENCES ", senceDetails.status[0])
  }, []);
  const [isSolved, setIsSolved] = useState(senceDetails.status[0]);
  const handleSolved = () => {
    // console.log('handleSolved')
    setIsSolved((item) => {
      updateSolved(senceDetails._id, !item);
      return !item;
    });
  };
  return (
    <div className={styles.listRow}>
      <div>{senceDetails.Topic}</div>
      <div>
        <input
          onClick={handleSolved}
          type="checkbox"
          defaultChecked={isSolved}
        />
      </div>
      <div>
        <a href={senceDetails.Link} target="_blank">
          {senceDetails.Prob}
        </a>
      </div>
      <div className={styles.rating}>{senceDetails.Rating}</div>
    </div>
  );
}

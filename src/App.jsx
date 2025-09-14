import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

const FF = ({id, ff})=>{
  return <article className="mx-8 m-4 rounded-lg shadow-lg border border-gray-200">
    <div className="bg-gray-100 p-2 font-medium">
      Fun fact n° : {id} 
    </div>
    <div className="p-4">
    {ff}
    </div>
  </article>
}

const AddFFModal = ()=>{ 
  const [ff, setFF] = useState('')

  const handleAdd = async (e)=>{
    await fetch("https://fun-fact-api-rsu4.onrender.com/funfact", {
      method:  "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        funfact: ff
      })
    }).then(res=>res.json())
    .then(res=>{
      alert('FunFact added')
      window.location.reload()
    })
    .catch(err=>console.error(err))
  }


  return <div className="flex flex-col m-8 items-center   shadow-2xl p-4 rounded-lg border  border-gray-200">
    <h3 className="text-xl">Add Fun Fact</h3>
    <textarea  onChange={(e)=>setFF(e.target.value)} name="" id="inputFF" className="bg-gray-100 w-full text-black">
  
    </textarea >
    <button className="bg-gray-400 text-white m-2 px-8 rounded-lg p-2 cursor-pointer" type="submit" onClick={handleAdd}>Add </button>
  </div>
}

function App() {
  const [ff, setFf] = useState([])

  useEffect(()=>{
    fetch('https://fun-fact-api-rsu4.onrender.com/funfact')
    .then(res=>res.json())
    .then(res=>{
      setFf(res)
    })
  }, [])
  return (
    <>
      <header className=" sticky flex top-2 mt-5 p-4 text-2xl shadow-lg justify-end m-2 rounded-lg border border-gray-200 bg-white">
        <span className="">FunFact</span>
      </header>

      <AddFFModal></AddFFModal>
      <section className="flex flex-col ">
        {ff.map(fact=><FF key={"ff"+fact.Id} id={fact.Id} ff={fact.FunFact}></FF>)}
      </section>
    </>
  );
}

export default App;

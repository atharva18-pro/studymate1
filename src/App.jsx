import React, { useEffect, useMemo, useState } from "react";
import {
  Home, CalendarDays, BookOpen, Bot, BarChart3, CheckSquare, FileText,
  Timer, Plus, Trash2, Check, Send, Sparkles, Moon, Sun, Menu, X,
  Clock3, ChevronRight
} from "lucide-react";

const seed = {
  profile: { name: "Student", standard: "10th", board: "Maharashtra State Board" },
  subjects: [
    { id: "math", name: "Mathematics", color: "indigo" },
    { id: "phy", name: "Physics", color: "blue" },
    { id: "chem", name: "Chemistry", color: "purple" },
    { id: "eng", name: "English", color: "green" }
  ],
  chapters: {
    math: ["Algebra", "Trigonometry", "Geometry", "Statistics"],
    phy: ["Electricity", "Light", "Motion"],
    chem: ["Acids and Bases", "Metals", "Carbon Compounds"],
    eng: ["Grammar", "Writing Skills", "Literature"]
  },
  timetable: [
    { id: 1, day: "Monday", start: "17:00", end: "18:00", subjectId: "math", chapter: "Trigonometry" },
    { id: 2, day: "Monday", start: "18:15", end: "19:15", subjectId: "phy", chapter: "Electricity" },
    { id: 3, day: "Tuesday", start: "17:00", end: "18:00", subjectId: "chem", chapter: "Acids and Bases" }
  ],
  tasks: [
    { id: 1, title: "Complete Maths homework", subjectId: "math", due: "Today", priority: "High", done: false },
    { id: 2, title: "Revise Electricity", subjectId: "phy", due: "Tomorrow", priority: "Medium", done: false },
    { id: 3, title: "English assignment", subjectId: "eng", due: "Friday", priority: "Low", done: true }
  ],
  notes: [
    { id: 1, title: "Trigonometry formulas", subjectId: "math", chapter: "Trigonometry", content: "Add important formulas and examples here." }
  ],
  progress: { math: 80, phy: 65, chem: 72, eng: 88 },
  tests: []
};

function loadData() {
  try {
    const saved = localStorage.getItem("studymate-data");
    return saved ? { ...seed, ...JSON.parse(saved) } : seed;
  } catch { return seed; }
}

const nav = [
  ["home", "Home", Home],
  ["timetable", "Timetable", CalendarDays],
  ["subjects", "Subjects", BookOpen],
  ["ai", "AI Study", Bot],
  ["progress", "Progress", BarChart3],
];

function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => localStorage.setItem("studymate-data", JSON.stringify(data)), [data]);

  const update = (patch) => setData(d => ({ ...d, ...patch }));

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className={mobileMenu ? "sidebar open" : "sidebar"}>
        <div className="brand"><div className="brandIcon"><Sparkles size={20}/></div><div><b>StudyMate</b><small>Plan • Study • Improve</small></div><button className="closeMobile" onClick={()=>setMobileMenu(false)}><X/></button></div>
        <nav>{nav.map(([id,label,Icon]) =>
          <button key={id} className={page===id ? "navItem active" : "navItem"} onClick={()=>{setPage(id);setMobileMenu(false)}}><Icon size={19}/><span>{label}</span></button>
        )}</nav>
        <div className="sidebarBottom">
          <button className="navItem" onClick={()=>setPage("tasks")}><CheckSquare size={19}/><span>Tasks</span></button>
          <button className="navItem" onClick={()=>setPage("notes")}><FileText size={19}/><span>Notes</span></button>
          <button className="navItem" onClick={()=>setDark(!dark)}>{dark?<Sun size={19}/>:<Moon size={19}/>}<span>{dark?"Light mode":"Dark mode"}</span></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobileMenu" onClick={()=>setMobileMenu(true)}><Menu/></button>
          <div><h1>{pageTitle(page)}</h1><p>{pageSubtitle(page)}</p></div>
          <div className="profileChip"><div className="avatar">{(data.profile.name||"S").slice(0,1).toUpperCase()}</div><span>{data.profile.name}</span></div>
        </header>
        <div className="content">
          {page==="home" && <HomePage data={data} setPage={setPage} update={update}/>}
          {page==="timetable" && <Timetable data={data} update={update}/>}
          {page==="subjects" && <Subjects data={data} update={update} setPage={setPage}/>}
          {page==="ai" && <AIPage data={data} update={update}/>}
          {page==="progress" && <Progress data={data}/>}
          {page==="tasks" && <Tasks data={data} update={update}/>}
          {page==="notes" && <Notes data={data} update={update}/>}
        </div>
      </main>
    </div>
  );
}

function pageTitle(p){return ({home:"Good morning! 👋",timetable:"My Timetable",subjects:"My Subjects",ai:"AI Study Assistant",progress:"My Progress",tasks:"Tasks & Assignments",notes:"My Notes"})[p]}
function pageSubtitle(p){return ({home:"Let's make today's study session count.",timetable:"Create a schedule that works for you.",subjects:"Organize subjects and chapters.",ai:"Learn, practice, test and revise.",progress:"See your learning journey at a glance.",tasks:"Keep your school work organized.",notes:"Keep your study material in one place."})[p]}

function HomePage({data,setPage,update}) {
  const today = new Date().toLocaleDateString("en-US",{weekday:"long"});
  const sessions = data.timetable.filter(x=>x.day===today);
  const next = sessions[0] || data.timetable[0];
  const subject = data.subjects.find(s=>s.id===next?.subjectId);
  const pending = data.tasks.filter(t=>!t.done);
  return <div className="page">
    <section className="hero">
      <div><span className="eyebrow">TODAY'S FOCUS</span><h2>Small progress every day becomes a big result.</h2><p>Your timetable and AI tutor work together to keep you on track.</p></div>
      <button className="primary" onClick={()=>setPage("ai")}><Bot size={18}/> Ask AI</button>
    </section>

    <div className="grid two">
      <Card title="Today's Study" icon={<CalendarDays/>} action={next && <button className="linkBtn" onClick={()=>setPage("timetable")}>View timetable <ChevronRight size={15}/></button>}>
        {next ? <div className="studyCard"><div className="time"><Clock3 size={16}/>{next.start} – {next.end}</div><h3>{subject?.name}</h3><p>{next.chapter}</p><div className="row"><button className="secondary" onClick={()=>setPage("ai")}>Study</button><button className="secondary" onClick={()=>setPage("ai")}>Test</button><button className="secondary" onClick={()=>setPage("ai")}>Revise</button></div></div> : <Empty text="Add a timetable session to get started."/>}
      </Card>
      <Card title="Pending Tasks" icon={<CheckSquare/>} action={<button className="linkBtn" onClick={()=>setPage("tasks")}>View all <ChevronRight size={15}/></button>}>
        {pending.slice(0,4).map(t=><TaskRow key={t.id} task={t} data={data} update={update}/>)}
        {!pending.length && <Empty text="Everything is completed. Great work! 🎉"/>}
      </Card>
    </div>

    <div className="sectionTitle"><h2>Quick actions</h2></div>
    <div className="quickGrid">
      <Quick icon={<Bot/>} title="Ask AI" text="Understand any topic" onClick={()=>setPage("ai")}/>
      <Quick icon={<Timer/>} title="Focus Timer" text="Start a study session" onClick={()=>setPage("ai")}/>
      <Quick icon={<FileText/>} title="My Notes" text="Review your notes" onClick={()=>setPage("notes")}/>
      <Quick icon={<BarChart3/>} title="Progress" text="Check your learning" onClick={()=>setPage("progress")}/>
    </div>

    <div className="grid two">
      <Card title="Subject Progress" icon={<BarChart3/>}>
        {data.subjects.map(s=><ProgressBar key={s.id} label={s.name} value={data.progress[s.id]||0}/>)}
      </Card>
      <Card title="Study tips" icon={<Sparkles/>}>
        <div className="tip"><b>🎯 Focus on one chapter at a time.</b><p>Use the AI test after studying to check your understanding.</p></div>
        <div className="tip"><b>🔄 Revise your mistakes.</b><p>Questions you get wrong are excellent revision targets.</p></div>
      </Card>
    </div>
  </div>
}

function Timetable({data,update}) {
  const [form,setForm]=useState({day:"Monday",start:"17:00",end:"18:00",subjectId:data.subjects[0]?.id||"",chapter:""});
  const add=()=>{if(!form.subjectId||!form.chapter)return; update({timetable:[...data.timetable,{...form,id:Date.now()}]});setForm(f=>({...f,chapter:""}))};
  const remove=id=>update({timetable:data.timetable.filter(x=>x.id!==id)});
  return <div className="page">
    <Card title="Add a study session" icon={<Plus/>}>
      <div className="formGrid">
        <Field label="Day"><select value={form.day} onChange={e=>setForm({...form,day:e.target.value})}>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Start time"><input type="time" value={form.start} onChange={e=>setForm({...form,start:e.target.value})}/></Field>
        <Field label="End time"><input type="time" value={form.end} onChange={e=>setForm({...form,end:e.target.value})}/></Field>
        <Field label="Subject"><select value={form.subjectId} onChange={e=>setForm({...form,subjectId:e.target.value})}>{data.subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Chapter / topic"><input placeholder="e.g. Trigonometry" value={form.chapter} onChange={e=>setForm({...form,chapter:e.target.value})}/></Field>
      </div>
      <button className="primary" onClick={add}><Plus size={17}/> Add session</button>
    </Card>
    <Card title="Weekly timetable" icon={<CalendarDays/>}>
      <div className="schedule">
        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day=>{
          const list=data.timetable.filter(x=>x.day===day);
          return <div className="day" key={day}><div className="dayName">{day}</div>{list.length?list.map(x=>{const s=data.subjects.find(a=>a.id===x.subjectId);return <div className="session" key={x.id}><div><b>{x.start} – {x.end}</b><span>{s?.name}</span><small>{x.chapter}</small></div><button className="iconBtn danger" onClick={()=>remove(x.id)}><Trash2 size={16}/></button></div>}):<small className="muted">No sessions</small>}</div>
        })}
      </div>
    </Card>
  </div>
}

function Subjects({data,update,setPage}) {
  const [name,setName]=useState("");
  const add=()=>{if(!name.trim())return;const id="s"+Date.now();update({subjects:[...data.subjects,{id,name:name.trim(),color:"indigo"}],chapters:{...data.chapters,[id]:[]},progress:{...data.progress,[id]:0}});setName("")};
  return <div className="page">
    <div className="addInline"><input placeholder="Add a subject..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/><button className="primary" onClick={add}><Plus size={17}/> Add</button></div>
    <div className="subjectGrid">{data.subjects.map(s=><div className="subjectCard" key={s.id}><div className="subjectIcon"><BookOpen/></div><h3>{s.name}</h3><p>{(data.chapters[s.id]||[]).length} chapters</p><ProgressBar label="" value={data.progress[s.id]||0}/><button className="secondary full" onClick={()=>setPage("ai")}>Study with AI <ChevronRight size={16}/></button></div>)}</div>
  </div>
}

function AIPage({data,update}) {
  const [subjectId,setSubjectId]=useState(data.subjects[0]?.id||"");
  const [chapter,setChapter]=useState("");
  const [mode,setMode]=useState("learn");
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([{role:"ai",text:"Hi! I'm your StudyMate AI tutor. Select a subject and chapter, then choose Learn, Practice, Test or Revision."}]);
  const [test,setTest]=useState(null);
  const subject=data.subjects.find(s=>s.id===subjectId);
  const chapters=data.chapters[subjectId]||[];
  const startAction=(m)=>{setMode(m);setTest(null);const topic=chapter||"your selected topic";let text="";
    if(m==="learn") text=`Let's learn ${topic}. Start by understanding the main idea, then work through examples. Ask me any question about ${topic}.`;
    if(m==="practice") text=`Practice mode for ${topic}: I can give you short questions one at a time. Try answering before checking the explanation.`;
    if(m==="revision") text=`Quick revision for ${topic}: review definitions, formulas, key ideas and common mistakes. Then take a short quiz.`;
    if(m==="test") {setTest(makeTest(topic,subject?.name)); text=`I've prepared a 5-question practice test on ${topic}. Good luck!`;}
    setMessages(x=>[...x,{role:"ai",text}]);
  };
  const send=()=>{if(!input.trim())return;const q=input.trim();setInput("");setMessages(x=>[...x,{role:"user",text:q},{role:"ai",text:`For ${chapter||"this topic"}: ${simpleAnswer(q)}\n\nFor a real AI tutor, connect your preferred AI API to the secure backend endpoint described in README.md.`}])};
  return <div className="page">
    <div className="aiLayout">
      <Card title="Choose what to study" icon={<BookOpen/>}>
        <Field label="Subject"><select value={subjectId} onChange={e=>{setSubjectId(e.target.value);setChapter("")}}>{data.subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Chapter / topic"><select value={chapter} onChange={e=>setChapter(e.target.value)}><option value="">Choose a chapter</option>{chapters.map(c=><option key={c}>{c}</option>)}</select></Field>
        <div className="modeGrid">{[["learn","📖","Learn"],["practice","🧠","Practice"],["test","📝","Test Me"],["revision","🔄","Revision"]].map(([id,icon,label])=><button className={mode===id?"mode active":"mode"} key={id} onClick={()=>startAction(id)}><span>{icon}</span><b>{label}</b></button>)}</div>
      </Card>
      <Card title="AI Tutor" icon={<Bot/>}>
        <div className="chat">{messages.map((m,i)=><div key={i} className={m.role==="user"?"bubble user":"bubble"}>{m.text}</div>)}{test&&<Test test={test} onDone={(score)=>{update({tests:[...data.tests,{id:Date.now(),subjectId,chapter,score,total:test.length}]});setMessages(x=>[...x,{role:"ai",text:`Test complete! You scored ${score}/${test.length}. Review the questions you missed and revise the topic.`}]);setTest(null)}}/>}</div>
        <div className="chatInput"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a question about your chapter..."/><button className="primary square" onClick={send}><Send size={18}/></button></div>
      </Card>
    </div>
    <FocusTimer/>
  </div>
}

function Test({test,onDone}) {
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const score=test.reduce((n,q)=>n+(answers[q.id]===q.answer?1:0),0);
  return <div className="testBox"><div className="testHead"><b>📝 Practice Test</b><span>{test.length} questions</span></div>{test.map((q,i)=><div className="question" key={q.id}><b>{i+1}. {q.q}</b>{q.options.map(o=><button key={o} className={answers[q.id]===o?"option selected":"option"} onClick={()=>!submitted&&setAnswers({...answers,[q.id]:o})}>{o}</button>)}{submitted&&<small>{answers[q.id]===q.answer?"✓ Correct":"Correct answer: "+q.answer}</small>}</div>)}{!submitted?<button className="primary" onClick={()=>setSubmitted(true)}>Submit test</button>:<div className="result"><h3>Score: {score}/{test.length}</h3><button className="primary" onClick={()=>onDone(score)}>Save result</button></div>}</div>
}

function Tasks({data,update}) {
  const [title,setTitle]=useState(""); const [subjectId,setSubjectId]=useState(data.subjects[0]?.id||"");
  const add=()=>{if(!title.trim())return;update({tasks:[...data.tasks,{id:Date.now(),title:title.trim(),subjectId,due:"Today",priority:"Medium",done:false}]});setTitle("")};
  return <div className="page"><Card title="Add task" icon={<Plus/>}><div className="formGrid"><Field label="Task"><input value={title} placeholder="e.g. Finish Maths homework" onChange={e=>setTitle(e.target.value)}/></Field><Field label="Subject"><select value={subjectId} onChange={e=>setSubjectId(e.target.value)}>{data.subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field></div><button className="primary" onClick={add}><Plus size={17}/> Add task</button></Card><Card title="Your tasks" icon={<CheckSquare/>}>{data.tasks.map(t=><TaskRow key={t.id} task={t} data={data} update={update} detailed/>)}</Card></div>
}
function TaskRow({task,data,update}){const s=data.subjects.find(x=>x.id===task.subjectId);return <div className={"taskRow "+(task.done?"done":"")}><button className="check" onClick={()=>update({tasks:data.tasks.map(x=>x.id===task.id?{...x,done:!x.done}:x)})}>{task.done&&<Check size={15}/>}</button><div><b>{task.title}</b><small>{s?.name} • {task.due}</small></div><span className={"priority "+task.priority.toLowerCase()}>{task.priority}</span></div>}

function Notes({data,update}) {
  const [title,setTitle]=useState("");const [content,setContent]=useState("");const [subjectId,setSubjectId]=useState(data.subjects[0]?.id||"");
  const add=()=>{if(!title.trim()||!content.trim())return;update({notes:[...data.notes,{id:Date.now(),title,content,subjectId,chapter:"Custom"}]});setTitle("");setContent("")};
  return <div className="page"><Card title="Create a note" icon={<Plus/>}><div className="formGrid"><Field label="Title"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title"/></Field><Field label="Subject"><select value={subjectId} onChange={e=>setSubjectId(e.target.value)}>{data.subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field></div><Field label="Content"><textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your notes..."/></Field><button className="primary" onClick={add}><Plus size={17}/> Save note</button></Card><div className="notesGrid">{data.notes.map(n=><div className="noteCard" key={n.id}><div className="noteTop"><FileText size={19}/><button className="iconBtn danger" onClick={()=>update({notes:data.notes.filter(x=>x.id!==n.id)})}><Trash2 size={16}/></button></div><h3>{n.title}</h3><small>{data.subjects.find(s=>s.id===n.subjectId)?.name}</small><p>{n.content}</p></div>)}</div></div>
}

function Progress({data}) {
  const totalTests=data.tests.length; const avg=totalTests?Math.round(data.tests.reduce((a,b)=>a+b.score/b.total,0)/totalTests*100):0;
  const totalProgress=data.subjects.length?Math.round(data.subjects.reduce((a,s)=>a+(data.progress[s.id]||0),0)/data.subjects.length):0;
  return <div className="page"><div className="statsGrid"><Stat label="Overall progress" value={totalProgress+"%"} icon={<BarChart3/>}/><Stat label="Tests completed" value={totalTests} icon={<CheckSquare/>}/><Stat label="Average test score" value={avg+"%"} icon={<Sparkles/>}/><Stat label="Chapters tracked" value={data.subjects.reduce((a,s)=>a+(data.chapters[s.id]||[]).length,0)} icon={<BookOpen/>}/></div><Card title="Subject progress" icon={<BarChart3/>}>{data.subjects.map(s=><ProgressBar key={s.id} label={s.name} value={data.progress[s.id]||0}/>)}</Card><Card title="Recent tests" icon={<CheckSquare/>}>{data.tests.length?data.tests.slice(-8).reverse().map(t=><div className="testHistory" key={t.id}><span>{data.subjects.find(s=>s.id===t.subjectId)?.name} — {t.chapter}</span><b>{t.score}/{t.total}</b></div>):<Empty text="Complete your first AI test and it will appear here."/>}</Card></div>
}

function FocusTimer(){const [seconds,setSeconds]=useState(25*60);const [running,setRunning]=useState(false);useEffect(()=>{if(!running)return;const i=setInterval(()=>setSeconds(s=>s>0?s-1:0),1000);return()=>clearInterval(i)},[running]);useEffect(()=>{if(seconds===0)setRunning(false)},[seconds]);const min=String(Math.floor(seconds/60)).padStart(2,"0"),sec=String(seconds%60).padStart(2,"0");return <div className="timerMini"><Timer size={18}/><b>Focus Timer</b><span>{min}:{sec}</span><button className="secondary" onClick={()=>setRunning(!running)}>{running?"Pause":"Start"}</button><button className="linkBtn" onClick={()=>{setRunning(false);setSeconds(1500)}}>Reset</button></div>}

function Card({title,icon,action,children}){return <section className="card"><div className="cardHead"><div className="titleWithIcon">{icon}<h2>{title}</h2></div>{action}</div>{children}</section>}
function Quick({icon,title,text,onClick}){return <button className="quick" onClick={onClick}><div className="quickIcon">{icon}</div><div><b>{title}</b><span>{text}</span></div><ChevronRight/></button>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function ProgressBar({label,value}){return <div className="progressWrap">{label&&<div className="progressLabel"><span>{label}</span><b>{value}%</b></div>}<div className="bar"><i style={{width:`${value}%`}}/></div></div>}
function Stat({label,value,icon}){return <div className="stat"><div className="statIcon">{icon}</div><span>{label}</span><b>{value}</b></div>}
function Empty({text}){return <div className="empty">{text}</div>}

function simpleAnswer(q){const l=q.toLowerCase();if(l.includes("formula"))return "A good approach is to identify what each symbol represents, write the known values, and substitute them step by step. I can explain a specific formula if you name it.";if(l.includes("define")||l.includes("meaning"))return "Start with a short definition, then connect it to an example. This makes the concept easier to remember.";return "Break the question into smaller parts, identify the concept involved, and solve it step by step. Try explaining your reasoning in your own words."}
function makeTest(topic,subject){return [
{id:1,q:`Which approach is most useful when learning ${topic}?`,options:["Memorize everything at once","Understand the concept and practice","Skip examples","Only read the title"],answer:"Understand the concept and practice"},
{id:2,q:`What should you do first when solving a new ${subject||"subject"} problem?`,options:["Guess","Identify the given information and what is asked","Look at the answer","Skip the question"],answer:"Identify the given information and what is asked"},
{id:3,q:`Which method helps with revision?`,options:["Active recall","Never testing yourself","Reading without thinking","Skipping mistakes"],answer:"Active recall"},
{id:4,q:`If you make a mistake in ${topic}, what is a useful next step?`,options:["Ignore it","Understand why it happened","Delete your notes","Stop practicing"],answer:"Understand why it happened"},
{id:5,q:`Which habit supports long-term learning?`,options:["Regular practice","Studying only once","Avoiding questions","Never reviewing"],answer:"Regular practice"}]}

export default App;
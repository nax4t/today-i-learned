import React, { useEffect, useState } from 'react'
import supabase from './supabase'
import './style.css'

const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
]

const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source:
      'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
]

const App = () => {
  const [showForm, setShowForm] = useState(false)
  const [facts, setFacts] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(
    function () {
      async function getFacts() {
        let query = supabase.from('facts').select('*')

        if (currentCategory !== 'all')
          query = query.eq('category', currentCategory)

        let { data: facts, error } = await query
          .order('votesInteresting', { ascending: false })
          .limit(1000)

        if (!error) setFacts(facts)
        else alert('There was a problem fetching results.')
      }
      getFacts()
    },
    [currentCategory]
  )

  // JavaScript has something better
  // const showAndHideForm = () => {
  //   showForm ? setShowForm(false) : setShowForm(true)
  // }

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* Fact Form */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className='main'>
        {/* Filter component */}
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {/* Facts list */}
        <FactList facts={facts} />
      </main>
    </>
  )
}

function Header({ showForm, setShowForm }) {
  const appTitle = 'Today I learned'
  return (
    <header className='header'>
      <div className='logo'>
        <img src='./images/logo.png' alt='Today I Learned Logo' />
        <h1>{appTitle}</h1>
      </div>
      <button
        className='btn btn-large btn-open'
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? 'Close' : 'Share a fact'}
      </button>
    </header>
  )
}

function NewFactForm({ setFacts, setShowForm }) {
  function isValidHttpUrl(string) {
    let url

    try {
      url = new URL(string)
    } catch (_) {
      return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const [text, setText] = useState('')
  const [source, setSource] = useState('http://www.example.com')
  const [category, setCategory] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const textLength = text.length

  const submitHandler = async (e) => {
    // 1- Prevent browser reload
    e.preventDefault()

    // 2- If the data is valid, create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // 3- Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // }

      // 3 - Upload the fact to supabase and get the new fact object
      setIsUploading(true)
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select()

      setIsUploading(false)

      // 4- Add a new fact to the UI
      if (!error) setFacts((facts) => [newFact[0], ...facts])

      // 5- Reset the input fields
      setText('')
      setSource('')
      setCategory('')
      // 6- Close the form
      setShowForm(false)
    }
  }

  return (
    <form className='fact-form' onSubmit={submitHandler}>
      <input
        type='text'
        placeholder='Share a fact with the world...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type='text'
        placeholder='Trustworthy source...'
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value=''>Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large' disabled={isUploading}>
        {isUploading ? 'Uploading your fact' : 'Post'}
      </button>
    </form>
  )
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button
            className='btn btn-all-categories'
            onClick={() => setCurrentCategory('all')}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className='category'>
            <button
              className='btn btn-category'
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function FactList({ facts }) {
  return (
    <section>
      {facts.length === 0 ? (
        <h2 className='message'>Loading...</h2>
      ) : (
        <ul className='facts-list'>
          {facts.map((fact) => (
            <Fact key={fact.id} fact={fact} />
          ))}
        </ul>
      )}
    </section>
  )
}

function Fact({ fact }) {
  function handlerVotes() {}

  return (
    <li className='fact'>
      <p>
        {fact.text}
        <a
          className='source'
          href={fact.source}
          rel='noreferrer'
          target='_blank'
        >
          (Source)
        </a>
      </p>
      <span
        className='tag'
        style={{
          backgroundColor: CATEGORIES.find((el) => el.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className='vote-buttons'>
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  )
}

export default App

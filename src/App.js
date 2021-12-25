import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

/**
 * Challenge 1: Spend 10-20+ minutes reading through the code
 * and trying to understand how it's currently working. Spend
 * as much time as you need to feel confident that you
 * understand the existing code (although you don't need
 * to fully understand everything to move on)
 *
 * Challenge 2:
 * 1. Every time the `notes` array changes, save it
 *    in localStorage. You'll need to use JSON.stringify()
 *    to turn the array into a string to save in localStorage.
 * 2. When the app first loads, initialize the notes state
 *    with the notes saved in localStorage. You'll need to
 *    use JSON.parse() to turn the stringified array back
 *    into a real JS array.
 *
 * This happened in the Sidebar component
 *
  * Challenge 3: Try to figure out a way to display only the
  * first line of note.body as the note summary in the
  * sidebar.
  *
  * Hint 1: note.body has "invisible" newline characters
  * in the text every time there's a new line shown. E.g.
  * the text in Note 1 is:
  * "# Note summary\n\nBeginning of the note"
  *
  * Hint 2: See if you can split the string into an array
  * using the "\n" newline character as the divider

 * 
 * Challenge 4: When the user edits a note, reposition
 * it in the list of notes to the top of the list
 *
 * Challenge 5: complete and implement the deleteNote function
 *
 * Hints:
 * 1. What array method can be used to return a new
 *    array that has filtered out an item based
 *    on a condition?
 * 2. Notice the parameters being based to the function
 *    and think about how both of those parameters
 *    can be passed in during the onClick event handler
 */

function App() {
  const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )

  // Lazy State initialization
  // const [state, setState] = React.useState(() => console.log('State initialization'));

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])


  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    // Put most recently-modified note at the top
    setNotes(oldNotes => {
      const newArray = []
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({...oldNote, body: text})
        } else {
          newArray.push(oldNote)
        }
      }
      return newArray;
    })
  }
    /*
    This does not rearrange the notes
    setNotes(oldNotes => oldNotes.map(oldNote => {
     return oldNote.id === currentNoteId
       ? { ...oldNote, body: text }
       : oldNote
    }))
    */ 

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  return (
    <main>
    {
      notes.length > 0
      ?
      <Split
        sizes={[30, 70]}
        direction="horizontal"
        className="split"
      >
        <Sidebar
          notes={notes}
          currentNote={findCurrentNote()}
          setCurrentNoteId={setCurrentNoteId}
          newNote={createNewNote}
          deleteNote={deleteNote}
        />
        {
          currentNoteId &&
          notes.length > 0 &&
          <Editor
            currentNote={findCurrentNote()}
            updateNote={updateNote}
          />
        }
      </Split>
      :
      <div className="no-notes">
        <h1>You have no notes</h1>
        <button
          className="first-note"
          onClick={createNewNote}
        >
          Create one now
        </button>
      </div>
    }
    </main>
  )
}

export default App;

import React, { useEffect, useState } from 'react'
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; 
import "prismjs/themes/prism-tomorrow.css";  
import Editor from "react-simple-code-editor"
import axios from "axios"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import Loader from './components/Loader';

const App = () => {
  const [code, setcode] = useState(`function addNumbers(a, b) {
  return a + b;
}
cd
// Function call
console.log(addNumbers(3, 5));
`);

  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview("");    
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      console.error(error);
      setReview("Something went wrong. Please try again.");
    }
    setLoading(false); 
  }

  return (
    <div className="h-screen w-screen bg-[#1a1919] p-4">
      <main className="flex gap-4 h-full">
        

        <div className="w-1/2 h-full overflow-auto bg-black rounded-xl pb-4 flex flex-col justify-between border-8 relative">
          <div className="bg-black rounded-md h-full overflow-auto">
            <Editor 
              value={code}
              onValueChange={code => setcode(code)}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", monospace',
                fontSize: 14,
                border: "1px solid #ddd",
                borderRadius: "5px",
                minHeight: "100%",
                height: "auto",
                width: "100%",
                color: "#fff",
                whiteSpace: "pre",
                outline: "none",
                boxShadow: "none",
                caretColor: "#fff",
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            className="absolute right-4 bottom-4 px-4 py-2 bg-purple-300 text-black rounded-md hover:bg-purple-400"
          >
            Review
          </button>
        </div>


        <div className="w-1/2 bg-[#373636] rounded-xl text-white overflow-auto pl-4 pt-3">
          {loading ? (
            <Loader />
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          )}
        </div>

      </main>
    </div>
  )
}

export default App;

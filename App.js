
import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [pagenumber, setpagenumber] = useState(1);
  const [product, setproduct] = useState([]);
  const [loading, setloading] = useState(true);
  const [hasmore, sethasmore] = useState(false);
  const observer = useRef();

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setpagenumber((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observer.current) observer.observe(observer.current);
  }, [handleObserver]);
  // setloading(true);
  const lastElementRef = useCallback(node => {

    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting) {
        setpagenumber(prepage => prepage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {

    axios({
      method: 'GET',
      url: 'https://dummyjson.com/products',
      params: { page: pagenumber }

    }).then(({ data }) => {
      setloading(true);
      setproduct(data.products);
      sethasmore(data.data.products.length > 0)
      setloading(false);
    }).catch(e => {
      console.log(e.response)
    })
  }, [pagenumber]);

  return (
    <div className="App">
      {product?.map((val) => {
        return val.images.map((vals, index) => {
          if (val.images.length === index + 1) {

            return <img src={vals} alt='image' ref={lastElementRef} style={{ marginBottom: '20px' }} width="300px" height="180px"></img>

          } else {
            return <img src={vals} alt='image' style={{ marginBottom: '20px' }} width="300px" height="180px"></img>
          }
        })
      })}
      {loading ? <div className="text-center">loading data ...</div> : ""}
      {hasmore ? <div className="text-center">no data anymore ...</div> : ""}
    </div>
  );
}
export default App;









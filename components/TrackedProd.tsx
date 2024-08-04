import {  useEffect, useState } from 'react';
import ProductCard from './ProductCard'; 
import Loading from './Loading';
interface Props {
  userEmail: string | null;
}
const TrackedProd: React.FC<Props> = ({ userEmail }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userEmail) {
        setError('User email is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch('https://pricewise-test.vercel.app/api/TrackedData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail: userEmail }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        // Await the JSON parsing
        const fetchedProducts = await response.json();
  
        // Set products state with the fetched products
        setProducts(fetchedProducts.products || []);
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [userEmail]);
   // Dependency array ensures fetch only when userEmail changes

  if (loading) return(
    <>
    <div className='flex justify-center items-center mt-40'>
      <div>
        <Loading/>
      </div>
    </div>
    </>
  ) 
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="trending-section">
      <h2 className="section-text">Tracked Products</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-16">
        {products.length > 0 ? (
          products.map((product: any) => (
            <div key={product._id}>
               <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div>No Products Tracked Yet.</div>
        )}
      </div>
    </section>
  );
};

export default TrackedProd;

'use client';
import { useEffect, useState } from 'react';
import ProductCard from '../../../components/ProductCard'; 
import { useUser } from '@clerk/nextjs';
import Loading from '@/components/Loading';

const TrackedProd: React.FC = () => {
 const {user} = useUser();
 if(!user) return;
 const userEmail = user.emailAddresses[0].emailAddress


  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userEmail) {
      // Early return if userEmail is not set
      setError('User email is required');
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pricewise-test.vercel.app/api/PastData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const fetchedProducts = await response.json();
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
      <h2 className="section-text">Previously Tracked Products</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-16">
        {products.length > 0 ? (
          products.map((product: any) => (
            <div key={product._id}>
              {product.isTracked && <ProductCard product={product} />}
            </div>
          ))
        ) : (
          <div>No Past Products To Display </div>
        )}
      </div>
    </section>
  );
};

export default TrackedProd;

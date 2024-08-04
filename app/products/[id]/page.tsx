"use client";
import React, { useEffect, useState } from "react";
import { addToLiked, getProduct, removeFromLiked } from "@/lib/actions";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import PriceInfoCard from "@/components/PriceInfoCard";
import { useRouter } from "next/router";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Modal from "@/components/Modal";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";

type Props = {
  params: { id: string };
};

const ProductDetails = ({ params: { id } }: Props) => {
  const shareUrl = `${window.location.href}`;
  const [product, setProduct] = useState<any>(null);
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress || "demo";

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(id);
      console.log("product", productData);
      setProduct(productData);
    };

    fetchProduct();
  }, [id]);

  // State for isLiked
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  // Set isLiked after product is fetched
  useEffect(() => {
    if (product) {
      setIsLiked(product.isLiked);
    }
  }, [product]);

  // Handle like/unlike actions
  useEffect(() => {
    const updateLikeStatus = async () => {
      if (isLiked !== null) {
        if (isLiked) {
          await addToLiked(id, userEmail);
        } else {
          await removeFromLiked(id, userEmail);
        }
      }
    };

    updateLikeStatus();
  }, [isLiked, id, userEmail]);

  if (!product) {
     return(
      <>
      <div className='flex justify-center items-center mt-40'>
        <div>
          <Loading/>
        </div>
      </div>
      </>
    ) 
  }

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <img
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap p-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                {product.isOutOfStock ? "Currently Out of Stock" : "In Stock"}
                <br />
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="product cursor-pointer"
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? (
                  <img
                    src="/assets/icons/heart.png"
                    alt="heart"
                    width={32}
                    height={32}
                  />
                ) : (
                  <img
                    src="/assets/icons/notLiked.png"
                    alt="heart"
                    width={32}
                    height={32}
                  />
                )}
              </div>

                  <div className="Demo__some-network">
                    <FacebookShareButton
                      url={shareUrl}
                      className="Demo__some-network__share-button"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </div>

                  <div className="Demo__some-network">
                    <WhatsappShareButton
                      url={shareUrl}
                      className="Demo__some-network__share-button"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>

                  <div className="Demo__some-network">
                    <TelegramShareButton
                      url={shareUrl}
                      className="Demo__some-network__share-button"
                    >
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                  </div>
                  <div className="Demo__some-network">
                    <TwitterShareButton
                      url={shareUrl}
                      className="Demo__some-network__share-button"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </div>


            </div>
          </div>

          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-secondary opacity-50 line-through">
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="product-stars">
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semiold">
                    {product.reviewsCount}
                  </p>
                </div>

                <div className="product-reviews">
                 
                  <p className="text-sm text-secondary font-semibold">
                    {product.discountRate}
                  </p>
                  <img
                    src="/assets/icons/discount.png"
                    alt="discount"
                    width={24}
                    height={24}
                  />
                 <p className="text-sm text-secondary font-semibold">
                    OFF
                  </p>
                </div>
              </div>
              <p className="text-sm text-black opacity-50">
                {product.buyers}
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />
            </div>
          </div>

          <Modal productId={id} tracker={product.isTracked} />
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>
          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <img src="/assets/icons/bag.svg" alt="check" width={22} height={22} />
          <Link href={product.url} className="text-base text-white">
            Buy Now
          </Link>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

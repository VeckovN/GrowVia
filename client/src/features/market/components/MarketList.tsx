import { FC, ReactElement } from "react"
import { useAppDispatch } from "../../../store/store";
import ProductMarketCard from "../../product/components/ProductMarketCard";
import MarketFarmerCard from "./MarketFarmerCard";
import { MarketListInterface } from "../market.interface";
import { CartProductInterface } from "../../cart/cart.interface";
import { handleAddToCart } from "../../shared/utils/utilsFunctions";

const MarketList:FC<MarketListInterface> = ({mode, items=[]}):ReactElement => {
    const dispatch = useAppDispatch();

    const onAddToCart = (farmerID: string, farmName: string, product:CartProductInterface ):void =>{
        handleAddToCart(dispatch, farmerID, farmName, product);
    }

    return (
        <div className="bg-red-300a">
            {mode === 'products' ? (
                <div className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-items-center gap-x-3 gap-y-3'>
                    {items.map(product =>(
                        <ProductMarketCard
                            key={product.id}
                            product={product}
                            addToCart={onAddToCart}
                            addToFavorite={() => alert("Add to Favorite")}
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] justify-items-center gap-x-3 gap-y-3 ">
                    {items.slice(0,12).map(farmer =>(
                        <div className='max-w-[400px]'>
                            <MarketFarmerCard 
                                key={farmer.id} 
                                farmer={farmer}
                            />
                        </div>
                    ))}
                </div>
            )            
        }
        </div>
    )
}

export default MarketList
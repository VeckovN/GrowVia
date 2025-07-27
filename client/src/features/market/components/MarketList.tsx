import { FC, ReactElement } from "react"
import { useAppDispatch } from "../../../store/store";
import { addProduct } from "../../cart/cart.reducers";
import { MarketListInterface } from "../market.interface";
import ProductMarketCard from "../../product/components/ProductMarketCard";
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
                <div className='bg-red-400a grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] w-fulla justify-items-center gap-x-3 gap-y-3'>
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
                <div className="farmer-grid">
                    {items.map(farmer =>(
                        <div> {farmer.farmName}</div>
                        // <FarmerCard key={product?.id} farmer={farmer}/>
                    ))}
                </div>
            )            
        }
        </div>
    )
}

export default MarketList
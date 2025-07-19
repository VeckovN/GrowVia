import { FC, ReactElement } from "react"
import { ProductDocumentInterface } from "../../product/product.interface"
import { FarmerDocumentInterface } from "../../farmer/farmer.interface";
import ProductMarketCard from "../../product/components/ProductMarketCard";

interface MarketListInterface {
    mode: 'products' | 'farmers',
    items: ProductDocumentInterface[] | FarmerDocumentInterface[];
    isLoading?: boolean;
}

// const MarketList:FC<MarketListInterface> = ({mode, products = [], farmers = [], isLoading}):ReactElement => {
const MarketList:FC<MarketListInterface> = ({mode, items=[]}):ReactElement => {
    return (
        <div className="bg-red-300a">
            {mode === 'products' ? (
                <div className='bg-red-400a grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] w-fulla justify-items-center gap-x-3 gap-y-3'>
                    {items.map(product =>(
                        <ProductMarketCard
                            product={product}
                            addToCart={() => alert("Add to Cart")}
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
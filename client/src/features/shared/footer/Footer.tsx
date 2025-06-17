import { FC, ReactElement } from "react";
import { Link } from "react-router-dom";

import FavebookIcon from '../../../assets/footer/facebook.svg';
import InstagramIcon from '../../../assets/footer/instagram.svg';
import TwitterIcon from '../../../assets/footer/twitter.svg';
import TiktokIcon from '../../../assets/footer/tiktok.svg';

import StripeIcon from '../../../assets/paymentCards/Stripe.svg';
import VisaCardIcon from '../../../assets/paymentCards/Visa.svg';
import MasterCardIcon from '../../../assets/paymentCards/Mastercard.svg';

import LogoIcon from '../../../assets/header/LogoIcon.svg';

const Footer:FC = (): ReactElement => {

    return (
        <footer className='w-full border-t border-greyB bg-white'>
            <div className='
                pt-12 pb-8
                mx-auto grid 
                grid-cols-2 gap-y-10
                xs:w-[80%]
                sm:grid-cols-4
                justify-items-center
            '>
                {/* Categories */}
                <div className="w-28">
                    <h3 className='text-lg font-semibold'>Categories</h3>
                    <ul className='space-y-1 pt-1'>
                        <li><Link to='/market?product=fruits'>Fruits</Link></li>
                        <li><Link to='/market?product=vegetables'>Vegetables</Link></li>
                        <li><Link to='/market?product=dairy'>Dairy Products</Link></li>
                        <li><Link to='/market?product=grains'>Grains</Link></li>
                        <li><Link to='/market?product=artisanGoods'>Artisan goods</Link></li>
                        <li><Link to='/market?product=eggs'>Eggs</Link></li>
                        <li><Link to='/market?product=herbsAndPlants'>Herbs&Plants</Link></li>
                    </ul>
                </div>

                {/* Explore */}
                <div className='w-28'>
                    <h3 className='text-lg font-semibold'>Explore</h3>
                    <ul className='space-y-1 pt-1'>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/market'>Market</Link></li>
                        <li><Link to='/farmers'>Farmers</Link></li>
                        <li><Link to='/about-us'>About Us</Link></li>
                    </ul>
                </div>

                {/* For Customer */}
                <div className='w-28'>
                    <h3 className='text-lg font-semibold whitespace-nowrap'>For Customer</h3>
                    <ul className='space-y-1 pt-1'>
                        <li><Link to='/customer/order'>Order Tracking</Link></li>
                        <li><Link to='/customer/order'>Payment</Link></li>
                        <li><Link to='/customer/order'>Shipping</Link></li>
                        <li><Link to='/customer/order'>How It works</Link></li>
                    </ul>
                </div>

                {/* For Farmer */}
                <div className='w-28'>
                    <h3 className='text-lg font-semibold whitespace-nowrap'>For Farmer</h3>
                    <ul className='space-y-1 pt-1'>
                        <li><Link to='/farmer/products'>Sell Products</Link></li>
                        <li><Link to='/farmer/home'>Dashboard</Link></li>
                        <li><Link to='/farmer/orders'>Check Orders</Link></li>
                        <li><Link to='/farmer/home'>Iot Management</Link></li>
                    </ul>
                </div>
            </div>

            <div className='
                flex flex-col justify-center items-center text-md font-medium 
                md:flex-row md:w-[70%] md:max-w-[800px] md:mx-auto md:justify-between
            '>   
                
                <div className='w-[60%] max-w-[250px]'>
                    <h3 className='text-center whitespace-nowrap py-2'>Lets' Grow Together</h3>
                    <div className='flex justify-between'>
                        <img 
                            className='w-10 h-10'
                            src={FavebookIcon}
                            alt='facebook'
                        />
                        <img 
                            className='w-10 h-10'
                            src={InstagramIcon}
                            alt='instagram'
                        />
                        <img 
                            className='w-10 h-10'
                            src={TwitterIcon}
                            alt='twitter'
                        />
                        <img 
                            className='w-10 h-10'
                            src={TiktokIcon}
                            alt='tiktok'
                        />
                    </div>
                </div>

                <div className='w-[50%] max-w-[250px] pt-10 md:pt-0'>
                {/* <div className='col-span-2 md:col-span-1 pt-10'> */}
                    <h3 className='text-center whitespace-nowrap py-2'>Secure Payments With</h3>
                    <div className='flex justify-between'>
                        <img 
                            className='w-14 h-14 xs:w-16 xs:s-16'
                            src={StripeIcon}
                            alt='stripe'
                        />
                        <img 
                            className='w-14 h-14 xs:w-16 xs:s-16'
                            src={VisaCardIcon}
                            alt='visa-card'
                        />
                        <img 
                            className='w-14 h-14 xs:w-16 xs:s-16'
                            src={MasterCardIcon}
                            alt='master-card'
                        />

                    </div>
                </div>

            </div>

            <div className='flex flex-col md:flex-row  items-center pt-14 pb-4'>
                <div className='flex'>
                    <img
                        className='w-8 h-8 md:ml-4'
                        src={LogoIcon}
                        alt='logo'
                    />
                    <div className=''>
                        <Link
                            className='font-poppins font-normal text-xl pl-2 '
                            to='/'
                        >
                            Growvia    
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row mx-auto font-light pt-2'>
                    <p className='text-center'>&copy; 2025 Novak Veckov. </p>
                    <p className="text-center">Built to empower local farms and communities. </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
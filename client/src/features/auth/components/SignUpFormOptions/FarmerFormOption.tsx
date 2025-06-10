import { FC, ChangeEvent } from 'react';

import TextField from '../../../shared/inputs/TextField';
import SelectField from '../../../shared/inputs/SelectField';
import { LocationInterface } from '../../auth.interfaces';
import { CustomerFormOptionPropsInterface } from '../../auth.interfaces';
import { CITIES } from '../../../shared/utils/data';

const FarmerFormOption: FC<CustomerFormOptionPropsInterface> = ({ userInfo, setUserInfo, validationErrors, actionError}) => {
    console.log("userInfo farmer: ", userInfo);
    
    
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;

        //handling location object with {city and address prop}
        if(name.startsWith("location.")) { 
            //example for city -> name:location.city
            const locationField = name.split('.')[1];//is 'city value'
            setUserInfo(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locationField]: value
                } as LocationInterface
            }));
        }
        else { 
            setUserInfo(prev => ({
            ...prev,
            [name]: value
            }));
        }
    };


  return (
    <div className="mt-10 space-y-6  ">

        {/* Row 1 - FarmName (half width) */}
        <div className="w-full md:w-1/2 md:pr-2">
            <label htmlFor="farmerName" className="text-sm font-medium text-gray-700">
            Farm Name
            </label>
            <TextField
                className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                id="farmerName"
                value={userInfo.farmName}
                name="farmName"
                type="text"
                placeholder="Enter Farm Name"
                onChange={handleChange}
            />
            {validationErrors.phoneNumber &&
                <label className='text-red-600 text-sm'>{validationErrors.phoneNumber}</label>
            }
        </div>
    
        {/* Row 2 - FirstName & LastName */}
        <div className="flex flex-col md:flex-row gap-4 ">
            <div className="w-full md:w-1/2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="firstName" //match label htmlFor 
                    value={userInfo.firstName}
                    name="firstName"
                    type="text"
                    placeholder='Enter First Name'
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                    //     setUserInfo({ ...userInfo, firstName: e.target.value})
                    // }}
                    onChange={handleChange}
                />
                {validationErrors.firstName &&
                    <label className='text-red-600'> {validationErrors.firstName}</label>
                }
            </div>
            <div className="w-full md:w-1/2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="lastName" //match label htmlFor 
                    value={userInfo.lastName}
                    name="lastName"
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                />
                {validationErrors.lastName &&
                    <label className='text-red-600'> {validationErrors.lastName}</label>
                }  
            </div>
        </div>

        {/* Row 3 - Username & Email */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="username" 
                    value={userInfo.username}
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                    onChange={handleChange}
                />
                {validationErrors.username &&
                    <label className='text-red-600'> {validationErrors.username}</label>
                }  
            </div>
            <div className="w-full md:w-1/2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Email
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="email" 
                    value={userInfo.email}
                    name="email"
                    type="text"
                    placeholder="Enter Email"
                    onChange={handleChange}
                />
                {validationErrors.email &&
                    <label className='text-red-600'> {validationErrors.email}</label>
                }  
            </div>
        </div>

        {/* Row 4 - Password & Repeat Password */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="password"
                    value={userInfo.password}
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                {validationErrors.password &&
                    <label className='text-red-600 text-sm'>{validationErrors.password}</label>
                }
            </div>
            <div className="w-full md:w-1/2">
                <label htmlFor="repeatPassword" className="text-sm font-medium text-gray-700">
                    Repeat Password
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="repeatPassword"
                    value={userInfo.repeatPassword}
                    name="repeatPassword"
                    type="password"
                    placeholder="Repeat Password"
                    onChange={handleChange}
                />
                {validationErrors.repeatPassword &&
                    <label className='text-red-600 text-sm'>{validationErrors.repeatPassword}</label>
                }
            </div>
        </div>

        {/* Row 5 - Phone Number (half width) */}
        <div className="w-full md:w-1/2 md:pr-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
            </label>
            <TextField
                className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                id="phoneNumber"
                value={userInfo.phoneNumber}
                name="phoneNumber"
                type="tel"
                placeholder="+381 or 06x"
                onChange={handleChange}
            />
            {validationErrors.phoneNumber &&
                <label className='text-red-600 text-sm'>{validationErrors.phoneNumber}</label>
            }
        </div>

        {/* Row 6 - City & Address */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
                </label>
                <SelectField 
                    className='p-[11px] pl-4'
                    id='city'
                    name='location.city'
                    value={userInfo.location?.city ?? ''}
                    options={CITIES}
                    onChange={handleChange}
                />
            </div>
            <div className="w-full md:w-1/2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
                </label>
                <TextField
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="address"
                    name="location.address"
                    value={userInfo.location?.address}
                    type="text"
                    placeholder="Address"
                    onChange={handleChange}
                />
                {validationErrors.address &&
                <label className='text-red-600 text-sm'>{validationErrors.address}</label>
                }
            </div>
        </div>

        {/* Row 7 - Avatar and Background Upload */}
        <div className="flex flex-col md:flex-row gap-4 ">
            <div className="w-full md:w-1/2">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                    Avatar
                </label>
                <input
                    type="file"
                    id="avatar"
                    name="profilePicture"
                    onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setUserInfo(prev => ({
                        ...prev,
                        profilePicture: URL.createObjectURL(e.target.files![0])
                        }));
                    }
                    }}
                    className="
                        mt-1 w-full text-sm text-gray-500 
                        border-2 rounded-md p-1
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-200 file:text-green8
                        hover:file:bg-gray-200
                    " 
                />
            </div>
            <div className="w-full md:w-1/2">
                <label htmlFor="background" className="text-sm font-medium text-gray-700">
                    Background image
                </label>
                <input
                    type="file"
                    id="background"
                    name="backgroundImage"
                    onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setUserInfo(prev => ({
                        ...prev,
                        backgroundImage: URL.createObjectURL(e.target.files![0])
                        }));
                    }
                    }}
                    className="
                        mt-1 w-full text-sm text-gray-500 
                        border-2 rounded-md p-1
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-200 file:text-green8
                        hover:file:bg-gray-200
                    " 
                />
            </div>
        </div>

        {/* Row 8 - Description (full width) */}
        <div className="w-full ">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
            </label>
            <textarea
                className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                id="description"
                value={userInfo.description}
                placeholder="Enter a detailed description to be shown on the full profile"
                onChange={handleChange}
            >

            </textarea>
            {validationErrors.description &&
                <label className='text-red-600 text-sm'>{validationErrors.description}</label>
            }
        </div>
    </div>
  );
};

export default FarmerFormOption
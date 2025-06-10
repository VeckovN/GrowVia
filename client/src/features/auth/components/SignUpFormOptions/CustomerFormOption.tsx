import { FC, ChangeEvent } from 'react';

import TextField from '../../../shared/inputs/TextField';
import SelectField from '../../../shared/inputs/SelectField';
import { LocationInterface } from '../../auth.interfaces';
import { CustomerFormOptionPropsInterface } from '../../auth.interfaces';
import { CITIES } from '../../../shared/utils/data';


const CustomerFormOption: FC<CustomerFormOptionPropsInterface> = ({ userInfo, setUserInfo, validationErrors, actionError }) => {
    console.log("userInfo: ", userInfo);
    console.log("\n validationErrors: ", validationErrors);    
    console.log("\n Action error: ", actionError);

    const getFieldError = (fieldName: string) => validationErrors[fieldName];

    const getBorderErrorStyle = (field: string): string =>{
        if(actionError || getFieldError(field))
            return 'border-0 border-b-4 border-red-400';
        else
            return '';

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
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

      {/* Row 1 - FirstName & LastName */}
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="w-full md:w-1/2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('firstName')}
                `}
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
            {/* {validationErrors.firstName && */}
            {getFieldError('firstName') &&
                <label className='text-red-600'>{getFieldError('firstName')}</label>
            }
        </div>
        <div className="w-full md:w-1/2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('lastName')}
                `}
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

      {/* Row 2 - Username & Email */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('username')}
                `}
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
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('email')}
                `}
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

      {/* Row 3 - Password & Repeat Password */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('password')}
                `}
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
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('repeatPassword')}
                `}
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

      {/* Row 4 - Phone Number (half width) */}
      <div className="w-full md:w-1/2 pr-1">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <TextField
            className={`
                w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                ${getBorderErrorStyle('phoneNumber')}
            `}
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

      {/* Row 5 - City & Address */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
            </label>
            <SelectField 
                className={`
                    p-[11px] pl-4
                    ${getBorderErrorStyle('location.city')}
                `}
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
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('address')}
                `}
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

      {/* Row 6 - Avatar Upload */}
      <div className="w-full">
        <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
          Profile Picture
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
    </div>
  );
};

export default CustomerFormOption
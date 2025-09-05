import SelectField from "../../shared/inputs/SelectField";
import TextField from "../../shared/inputs/TextField";
import { CITIES } from "../../shared/utils/data";

import { InfoFormProps } from "../farmer.interface";

const InfoForm: React.FC<InfoFormProps> = ({
    userData,
    authUser,
    validationErrors,
    onChange,
    getBorderErrorStyle,
    handleSocialChange
}) => {
    return (
        <>
            <div className="w-full md:w-1/2 md:pr-2">
                <label htmlFor="farmerName" className="text-sm font-medium text-gray-700">
                    Farm Name
                </label>
                <TextField
                    className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${getBorderErrorStyle('farmName')}`}
                    id="farmerName"
                    value={userData.farmName}
                    name="farmName"
                    type="text"
                    placeholder="Enter Farm Name"
                    onChange={onChange}
                />
                {validationErrors.farmName && (
                    <label className='text-red-600 text-sm'>{validationErrors.farmName}</label>
                )}
            </div>

            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <TextField
                        className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${getBorderErrorStyle('firstName')}`}
                        id="firstName"
                        value={userData.firstName}
                        name="firstName"
                        type="text"
                        placeholder='Enter First Name'
                        onChange={onChange}
                    />
                    {validationErrors.firstName && (
                        <label className='text-red-600 text-sm'>{validationErrors.firstName}</label>
                    )}
                </div>
                
                <div className="w-full md:w-1/2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <TextField
                        className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${getBorderErrorStyle('lastName')}`}
                        id="lastName"
                        value={userData.lastName}
                        name="lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        onChange={onChange}
                    />
                    {validationErrors.lastName && (
                        <label className='text-red-600 text-sm'>{validationErrors.lastName}</label>
                    )}  
                </div>
            </div>

            {/* Username & Email (Read-only) */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <TextField
                        className="w-full p-2 pl-4 border-2 rounded-md shadow-sm bg-greySbtn text-gray-600"
                        value={authUser.username}
                        disabled
                        onChange={() => {}}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <TextField
                        className="w-full p-2 pl-4 border-2 rounded-md shadow-sm bg-greySbtn text-gray-500"
                        value={authUser.email}
                        disabled
                        onChange={() => {}}
                    />
                </div>
            </div>

            {/* Phone Number */}
            <div className="w-full md:w-1/2 md:pr-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <TextField
                    className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${getBorderErrorStyle('phoneNumber')}`}
                    id="phoneNumber"
                    value={userData.phoneNumber}
                    name="phoneNumber"
                    type="tel"
                    placeholder="+381 or 06x"
                    onChange={onChange}
                />
                {validationErrors.phoneNumber && (
                    <label className='text-red-600 text-sm'>{validationErrors.phoneNumber}</label>
                )}
            </div>

            {/* City & Address */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City
                    </label>
                    <SelectField 
                        className={`p-[11px] pl-4 bg-white text-gray-500 ${getBorderErrorStyle('location')}`}
                        id='city'
                        name='location.city'
                        value={userData.location?.city ?? ''}
                        options={CITIES}
                        onChange={onChange}
                    />
                    {validationErrors.location && (
                        <label className='text-red-600 text-sm'>{validationErrors.location}</label>
                    )}
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <TextField
                        className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${getBorderErrorStyle('address')}`}
                        id="address"
                        name="location.address"
                        value={userData.location?.address}
                        type="text"
                        placeholder="Address"
                        onChange={onChange}
                    />
                    {validationErrors.location && (
                        <label className='text-red-600 text-sm'>{validationErrors.location}</label>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="w-full">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                    id="description"
                    name='description'
                    value={userData.description}
                    placeholder="Enter a detailed description to be shown on the full profile"
                    onChange={onChange}
                />
                {validationErrors.description && (
                    <label className='text-red-600 text-sm'>{validationErrors.description}</label>
                )}
            </div>

            <div className='w-full'>
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Map Location
                </label>
                <div className=''>
                    <TextField
                        className={``}
                        id="location"
                        name="location"
                        value={userData.location?.address}
                        type="radio"
                        placeholder="Address"
                        // onChange={handleChange}
                    />
                    <label> Use your location (enable it)</label>
                </div>
                <div className=''>
                    <TextField
                        className={``}
                        id="location"
                        name="location"
                        value={userData.location?.address}
                        type="radio"
                        placeholder="Address"
                        // onChange={handleChange}
                    />
                    <label> Select manually your location </label>
                </div>


                <div className='google map'>

                </div>
            </div>

            <div className="w-full md:w-1/2">
            <label htmlFor="social" className="text-sm font-medium text-gray-700 ">
                Social
            </label>
            {userData.socialLinks?.map((el, index) => (
                <div key={`${el.name}`} className='my-2'>
                    <label  htmlFor={el.name} className="text-sm font-medium text-gray-700">
                        {`${el.name}`}
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('social')}
                        `}
                        id="el.name"
                        name={el.name}
                        value={el.url || ''}
                        type="text"
                        placeholder={`Enter ${el.name} link`}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                    />
                </div>
            ))}
        </div>
        </>
    );
};

export default InfoForm;
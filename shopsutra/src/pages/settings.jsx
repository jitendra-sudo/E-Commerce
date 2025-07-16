import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate()

    const handleSave = (e) => {
        e.preventDefault();
        const settingsData = { emailNotifications, language, };
        console.log('Saving settings:', settingsData);
       navigate('/')
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-300">
            <h1 className="text-2xl font-semibold mb-6 text-center">Settings</h1>
            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex justify-between items-center">
                    <label className={`text-gray-700`}>
                        Email Notifications
                    </label>
                    <div
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                            } `}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        ></div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Preferred Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >
                        <option value="en">English</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"     >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default Settings;

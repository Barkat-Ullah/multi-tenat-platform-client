"use client"
import { useGetSingleUserQuery } from "@/redux/service/admin/userApi";
import { useParams } from "next/navigation";
import Spinner from "../ui/Spinner";
import { normalizeRole } from "@/utils/roles";

const ViewDetails = () => {
    const id = useParams().id
    const { data, isLoading } = useGetSingleUserQuery(id)

    if (isLoading) return <Spinner />
    
    // Extract user data from the response
    const userData = data?.data || data?.user || data
    const role = normalizeRole(userData?.role);
    
    if (!userData) return <div>No user data found</div>

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8 md:mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-poppins m-0">User Details</h2>
                <button 
                    onClick={() => window.location.href = `/dashboard/admin/user-properties/${id}`}
                    className="px-4 py-2 bg-[#004E60] text-white rounded-lg text-sm font-medium hover:bg-[#003944] transition-colors"
                >
                    View Properties
                </button>
            </div>
            
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Basic Information */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{userData.profile?.name || userData.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{userData.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{userData.profile?.phone || userData.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {role || 'N/A'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Account Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    userData.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {userData.status || 'N/A'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Verified</p>
                            <p className="font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    userData.verified ? 'bg-green-100 text-green-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {userData.verified ? 'Verified' : 'Not Verified'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className=" pb-4">
                    <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Street</p>
                            <p className="font-medium">{userData.profile?.street || userData.street || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="font-medium">{userData.profile?.city || userData.city || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Region</p>
                            <p className="font-medium">{userData.profile?.region || userData.region || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Country</p>
                            <p className="font-medium">{userData.profile?.country || userData.country || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Zip Code</p>
                            <p className="font-medium">{userData.profile?.zipCode || userData.zipCode || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">User ID</p>
                            <p className="font-medium text-sm break-all">{userData.id || userData._id || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Method</p>
                            <p className="font-medium">{userData.method || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {/* Description if available */}
                    {userData.profile?.description && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="font-medium mt-1 p-3 bg-gray-50 rounded">{userData.profile.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;

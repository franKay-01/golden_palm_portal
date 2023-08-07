import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { ShowToast } from "../utils/showToast"
import useFunctions from "../utils/functions"
import ReactPaginate from "react-paginate";
import useExtraUtil from "../utils/dateUtil";

export default function Users(){
  const [users, setUsers] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0);

  const { getUsersInfo, adminChangeUserStatus } = useFunctions();
  const { getDateString, getElemenetStatus } = useExtraUtil();

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;

  const pageCount = Math.ceil(users.length / PER_PAGE);

  const handleUserPageClick = ({selected}) => {
    setCurrentPage(selected)
  }

  const getUsers = async () => {
    setIsLoading(true)

    const {response_code, allUsers} = await getUsersInfo();
    if (response_code === "000"){
      setUsers(allUsers)
      setIsLoading(false)
    }else{
      ShowToast('error', "Error retrieving data")
      setIsLoading(false)
    }
  }

  const submitUserStatus = async (reference_no) => {
    const result = window.confirm("Are you sure you want to perform this action?");
    if (result) {

      const params = {
        reference_no
      }

      const {response_code} = await adminChangeUserStatus(params)
      if (response_code === '000'){
        ShowToast("success", "User status was changed successfully.")
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }else{
        ShowToast("error", "User status change failed. Please try again in a few minutes")
        setIsLoading(false)
      }
    } else {
      return
    }
  }

  const currentUserPageData = !!users && users.slice(offset, offset + PER_PAGE).map((data) => {
    return <div class="grid grid-cols-7 product-border">
      <div scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black">
      {getDateString(data.createdAt)}
      </div>
      <div class="px-6 py-4">
        {data.first_name} {data.last_name}
      </div>
      <div class="px-6 py-4">
        {data.email}
      </div>
      <div class="px-6 py-4">
        {data.phone_number}
      </div>
      <div class="px-6 py-4">
        {data.country}
      </div>
      <div className="px-6 py-4">
        {getElemenetStatus(data.is_active)}
      </div>
      <div class="px-6 py-4 flex flex-row space-x-2">
        { data.is_active ? 
          <svg onClick={()=> submitUserStatus(data.reference_no)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 red-label cursor-pointer">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
          </svg>
          :
          <svg onClick={()=> submitUserStatus(data.reference_no)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer green-label">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        }
      </div>
    </div>
  })

  useEffect(()=>{
    getUsers()
  }, [])

  return (
    <>
      <Navbar/>

      <div className="container overflow-auto">
        <div className="grid grid-cols-1 gap-4 mt-12 p-2">
          <div className="banner-card flex flex-col w-72">
            { isLoading ? 
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{users.length}</h1>
            }
            
            <div className="flex justify-between">
              <h1 className="banner-card-heading banner-card-heading-alt">No. of users</h1> 
            </div>
          </div>
        </div>  
        <div className="banner-card mt-8">
          <div className="grid grid-cols-7">
            <div className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black underline">Date Created</div>
            <div class="px-6 py-4 underline">Name</div>
            <div class="px-6 py-4 underline">Email</div>
            <div class="px-6 py-4 underline">Phone</div>
            <div class="px-6 py-4 underline">Country</div>
            <div class="px-6 py-4 underline">Status</div>
            <div class="px-6 py-4 underline">Option</div>
          </div>
          { users.length === 0 ? 
            <div className="flex justify-center">
              <span>No User Record Available</span>
            </div>
            :
            null
          }
          {!!users && currentUserPageData}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handleUserPageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </div>
    </>
  )
}
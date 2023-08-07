import { useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { ShowToast } from "../utils/showToast"
import useFunctions from "../utils/functions"
import { useState } from "react";
import ReactPaginate from "react-paginate";
import useExtraUtil from "../utils/dateUtil";

export default function Home(){
  const [user, setUserCount] = useState(0)
  const [order, setOrderCount] = useState(0)
  const [product, setProductCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUsers, setCurrentUsers] = useState([])
  const [currentOrders, setCurrentOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(0);

  const { getHomeData } = useFunctions();
  const { getDateString, getElemenetStatus } = useExtraUtil();

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const orderOffset = currentOrderPage * PER_PAGE;

  const pageCount = Math.ceil(currentUsers.length / PER_PAGE);
  const pageOrderCount = Math.ceil(currentOrders.length / PER_PAGE);

  const handleOrderPageClick = ({selected}) => {
    setCurrentOrderPage(selected)
  }
  const handleUserPageClick = ({selected}) => {
    setCurrentPage(selected)
  }

  const  getHomePageInfo = async () => {
    setIsLoading(true)

    const {response_code, userCount, orderCount, productCount, latestUsers, latestOrders} = await getHomeData();
    if (response_code === "000"){
      setUserCount(userCount)
      setOrderCount(orderCount)
      setProductCount(productCount)
      setCurrentUsers(latestUsers)
      setCurrentOrders(latestOrders)
      setIsLoading(false)
    }else{
      ShowToast('error', "Error retrieving data")
      setIsLoading(false)
    }
  }

  const currentOrderPageData = !!currentOrders && currentOrders.slice(orderOffset, orderOffset + PER_PAGE).map((data) => {
    return <div class="grid grid-cols-5">
      <div scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black">
      {getDateString(data.createdAt)}
      </div>
      <div class="px-6 py-4">
        {data.first_name} {data.last_name}
      </div>
      <div class="px-6 py-4">
        {data.phone_number}
      </div>
      <div className="px-6 py-4">
        {getElemenetStatus(data.is_active)}
      </div>
      <div class="px-6 py-4 flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 red-label cursor-pointer">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  })


  const currentUserPageData = !!currentUsers && currentUsers.slice(offset, offset + PER_PAGE).map((data) => {
    return <div class="grid grid-cols-5">
      <div scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black">
      {getDateString(data.createdAt)}
      </div>
      <div class="px-6 py-4">
        {data.first_name} {data.last_name}
      </div>
      <div class="px-6 py-4">
        {data.phone_number}
      </div>
      <div className="px-6 py-4">
        {getElemenetStatus(data.is_active)}
      </div>
      <div class="px-6 py-4 flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 red-label cursor-pointer">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  })

  useEffect(()=>{
    getHomePageInfo()
  }, [])
  return (
    <>
      <Navbar/>

      <div className="container overflow-auto">
        <div className="flex flex-row lg:grid md:flex lg:grid-cols-3 md:flex-row lg:gap-4 md:gap-4 mt-12 p-2">
          <div className="banner-card flex flex-col">
            { isLoading ? 
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{user}</h1>
            }
            
            <h1 className="banner-card-heading">No. of users</h1> 
          </div>
          <div className="banner-card flex flex-col">
            { isLoading ?
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{order}</h1>
            }
           
            <h1 className="banner-card-heading">Total orders</h1>  
          </div>
          <div className="banner-card flex flex-col">
            { isLoading ?
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{product}</h1>
            }
            <h1 className="banner-card-heading">Products</h1> 
          </div>
        </div>  
        <div className="banner-card mt-8">
          <h1 className="table-heading">Last 20 registered users</h1> 
          <div className="grid grid-cols-5">
            <div className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black underline">Date Joined</div>
            <div class="px-6 py-4 underline">Name</div>
            <div class="px-6 py-4 underline">Phone</div>
            <div class="px-6 py-4 underline">Status</div>
            <div class="px-6 py-4 underline">Options</div>
          </div>
          { currentUsers.length === 0 ? 
            <div className="flex justify-center">
              <span>No User Record Available</span>
            </div>
            :
            null
          }
          {!!currentUsers && currentUserPageData}
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

        <div className="banner-card mt-8">
          <h1 className="table-heading">Last 20 confirmed orders</h1> 
          <div className="grid grid-cols-5">
            <div className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black underline">Date</div>
            <div class="px-6 py-4 underline">Customer</div>
            <div class="px-6 py-4 underline">Item(s)</div>
            <div class="px-6 py-4 underline">Quantity</div>
            <div class="px-6 py-4 underline">Amount</div>
          </div>
          { currentOrders.length === 0 ? 
            <div className="flex justify-center">
              <span>No Order Record Available</span>
            </div>
            :
            null
          }
          {!!currentOrders && currentOrderPageData}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageOrderCount}
            onPageChange={handleOrderPageClick}
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
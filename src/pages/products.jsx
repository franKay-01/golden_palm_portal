import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { ShowToast } from "../utils/showToast"
import useFunctions from "../utils/functions"
import ReactPaginate from "react-paginate";
import useExtraUtil from "../utils/dateUtil";
import { Dialog } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const navigate = useNavigate();

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0);

  const [categoryName, setCategoryName] = useState('')

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)

  const { getProductInfo, adminCreateCategory, adminChangeProductStatus } = useFunctions();
  const { getDateString, getElemenetStatus } = useExtraUtil();

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;

  const pageCount = Math.ceil(products.length / PER_PAGE);

  const handleUserPageClick = ({selected}) => {
    setCurrentPage(selected)
  }

  const redirectToCreatePage= () => {
    if (categories.length > 0){
      navigate('/create-product-page', { state: { categories } });
    }else{
      ShowToast("error", "You cannot create products without categories")
    } 
  };
  
  const redirectToEditPage= (product) => {
    if (categories.length > 0){
      navigate('/edit-product-page', { state: { product, categories } });
    }else{
      ShowToast("error", "You cannot create products without categories")
    } 
  };

  const getProducts = async () => {
    setIsLoading(true)

    const {response_code, allCategories, allProducts} = await getProductInfo();
    if (response_code === "000"){
      setProducts(allProducts)
      setCategories(allCategories)
      setIsLoading(false)
    }else{
      ShowToast('error', "Error retrieving data")
      setIsLoading(false)
    }
  }

  const submitProductStatus = async (sku) => {
    const result = window.confirm("Are you sure you want to perform this action?");
    if (result) {

      const params = {
        sku
      }

      const {response_code} = await adminChangeProductStatus(params)
      if (response_code === '000'){
        ShowToast("success", "Product status was changed successfully.")
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }else{
        ShowToast("error", "Product status change failed. Please try again in a few minutes")
        setIsLoading(false)
      }
    } else {
      return
    }
  }

  const currentProductPageData = !!products && products.slice(offset, offset + PER_PAGE).map((data) => {
    return <div class="grid grid-cols-6 product-border">
      <div scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black">
      {getDateString(data.createdAt)}
      </div>
      <div class="px-6 py-4">
        {data.name}
      </div>
      <div class="px-6 py-4">
        $ {data.price}
      </div>
      <div class="px-6 py-4">
        {data.categories.name}
      </div>
      <div className="px-6 py-4">
        {getElemenetStatus(data.is_active)}
      </div>
      <div class="px-6 py-4 flex flex-row space-x-2">
        <svg onClick={()=> redirectToEditPage(data)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        { data.is_active ? 
          <svg onClick={()=> submitProductStatus(data.sku)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 red-label cursor-pointer">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
          </svg>
          :
          <svg onClick={()=> submitProductStatus(data.sku)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer green-label">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        }
      </div>
    </div>
  })

  const changeCategoryName = (e) => {
    setCategoryName(e.target.value)
  }

  const submitCategoryRecord = async () => {
    setIsLoading(true)
    if (categoryName === ''){
      ShowToast('error', "Category name is required")
      setIsLoading(false)
    }

    const params = {
      "category_name": categoryName
    }

    const {response_code} = await adminCreateCategory(params);
    if (response_code === '000'){
      ShowToast("success", "Category was created successfully.")
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }else{
      ShowToast("error", "Category creation failed. Please try again in a few minutes")
    }
  }

  useEffect(()=>{
    getProducts()
  }, [])
  return (
    <>
      <Navbar/>

      <div className="container overflow-auto">
        <div className="grid grid-cols-2 gap-4 mt-12 p-2">
          <div className="banner-card flex flex-col">
            { isLoading ? 
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{categories.length}</h1>
            }
            
            <div className="flex justify-between">
              <h1 className="banner-card-heading banner-card-heading-alt">No. of categories</h1> 
              <svg onClick={() => setIsCategoryOpen(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-9 h-8 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
          </div>
          <div className="banner-card flex flex-col">
            { isLoading ? 
              <span className="spinner-position spinner-position-alt">
                <div class="w-6 h-6 rounded-full animate-spin
                  border border-solid border-white border-t-transparent"></div>
              </span>
              :
              <h1 className="banner-card-heading">{products.length}</h1>
            }
            <div className="flex justify-between">
              <h1 className="banner-card-heading banner-card-heading-alt">No. of products</h1> 
              <svg onClick={() => redirectToCreatePage()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-9 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            
          </div>
        </div>  
        <div className="banner-card mt-8">
          <div className="grid grid-cols-6">
            <div className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black underline">Date Created</div>
            <div class="px-6 py-4 underline">Name</div>
            <div class="px-6 py-4 underline">Price</div>
            <div class="px-6 py-4 underline">Category</div>
            <div class="px-6 py-4 underline">Status</div>
            <div class="px-6 py-4 underline">Options</div>
          </div>
          { products.length === 0 ? 
            <div className="flex justify-center">
              <span>No product Record Available</span>
            </div>
            :
            null
          }
          {!!products && currentProductPageData}
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
      <Dialog
        open={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-8">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto rounded bg-white dialog-box-shadow dialog-box-shadow-alt">
              <Dialog.Panel>
                <Dialog.Title className='header-alt mt-8 text-center mb-4'>Category Creation</Dialog.Title>
                <hr className="mb-4"></hr>
                <>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-8 justify-center text-center login-text-position">
                    <div className="mt-2.5 p-8">
                      {/* <div className="input-wrapper"> */}
                      <div className="brand-input-box brand-input-box-alt flex flex-row">
                        <input className='main-input-box' onChange={changeCategoryName} value={categoryName} placeholder="Category Name *"/>
                      </div>
                        {/* <label htmlFor="role" className='input-label'>Name</label>
                        <input type="text" name='role' onChange={changeCategoryName} value={categoryName} className='input-text input-text-alt'/>
                      </div> */}
                    </div>
                  </div>
                    
                  <div className='flex flex-row space-x-4 justify-center mb-8 mt-8'>
                 
                    <button onClick={submitCategoryRecord} className="brand-button cursor-pointer">
                      { isLoading ? 
                        <span className="spinner-position spinner-position-alt">
                          <div class="w-6 h-6 rounded-full animate-spin
                            border border-solid border-yellow-500 border-t-transparent"></div>
                        </span>
                        :
                        <span className="brand-button-text">Submit Record</span>
                      }
                    </button>
                  </div>
                </>
              </Dialog.Panel>
            </Dialog.Panel>
          </div>
      </Dialog>
    </>
  )
}
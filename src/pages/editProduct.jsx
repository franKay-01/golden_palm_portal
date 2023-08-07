import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from '@headlessui/react'

import Navbar from "../components/navbar";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { ShowToast } from "../utils/showToast"
import useFunctions from "../utils/functions"
import useUploadFunction from "../utils/imageFileUpload";
import $ from 'jquery'; 

export default function EditProduct(){
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product || []; 
  const categories = location.state?.categories || []; 

  const [listedCategories, setListedCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [surveyImage, setSurveyImage] = useState("")
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState(0)
  const [productImage, setProductImage] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [selected, setSelected] = useState([])
  const [query, setQuery] = useState('')

  const {handleImageUploads} = useUploadFunction();
  const { adminEditProduct } = useFunctions()

  const filteredCategories =
  query === ''
    ? listedCategories
    : listedCategories.filter((category) =>
        category.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  const changeProductPrice = (e) => {
    setProductPrice(e.target.value)
  }

  const submitProductRecord = async () => {
    if (productName === "" || productDescription === "" || selected.length > 0){
      ShowToast("error", "Please fill all fields, except for the file upload")
      return
    }

    setIsLoading(true)

    let fileBase64 = null;
    if (surveyImage){
      fileBase64 = await handleImageUpload()
    }else{
      fileBase64 = productImage
    }

    const params = {
      "sku": product.sku,
      "name": productName, 
      "description": productDescription, 
      "price": productPrice, 
      "category_ref_no": selected.id || selected.reference_no,
      "img_url": fileBase64
    }

    const {response_code} = await adminEditProduct(params)
    if (response_code === '000'){
      ShowToast("success", "Product was editted successfully.")
      setTimeout(() => {
        navigate("/products")
      }, 1000);
    }else{
      ShowToast("error", "Product edit failed. Please try again in a few minutes")
      setIsLoading(false)
    }
  }

  const changeProductDescription = (e) => {
    setProductDescription(e.target.value)
  }

  const changeProductName = (e) => {
    setProductName(e.target.value)
  }
  
  const handleImageUpload = async () => {
    const input = document.getElementById('imageUpload');
    const file = input.files[0];
    const imageUrl = await handleImageUploads(file)

    return imageUrl
  };
  
  const readURL = () => {
    let input = document.getElementById('imageUpload')

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        setSurveyImage(reader.result.split(',')[1])
        $('#imagePreview').css('background-image', 'url('+e.target.result +')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  useEffect(()=>{
    let arrangedCategories = []
    categories.map((data) => {
      arrangedCategories.push({id: data.reference_no, name: data.name})
      if (product.categories.name === data.name){
        setSelected(data)
      }
    })
    setListedCategories(arrangedCategories)

    setProductName(product.name)
    setProductDescription(product.description)
    setProductPrice(product.price)
    setProductImage(product.img_url)
  },[])

  return (
    <>
      <Navbar/>
      <div className="container overflow-auto">
        <div className="banner-card flex flex-col justify-center">
          <div className="input-wrapper">
            <div className="img-container">
              <div className="avatar-upload">
                  <div className="avatar-edit">
                    <input type='file' name='imageUpload' id="imageUpload" onChange={()=> readURL()} accept=".png, .jpg, .jpeg" />
                    <label for="imageUpload"></label>
                  </div>
                  <div className="avatar-preview">
                    <div id="imagePreview" className='background-pattern object-contain'>
                    </div>
                  </div>
              </div>
            </div>
            <div className="mt-2.5 product-p flex flex-col space-y-8">
              <div className="flex flex-row space-x-4">
                { productImage === "" ? 
                  <>
                    <h1 className="table-heading">Image Url</h1> 
                    <a href={productImage} target="blank" className="table-heading table-heading-alt">{productImage}</a> 
                  </>
                  :
                  null
                }
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="brand-input-box brand-input-box-alt flex flex-row">
                  <input className='main-input-box' onChange={changeProductName} value={productName} placeholder="Product Name *"/>
                </div>
                <div className="brand-input-box brand-input-box-alt flex flex-row">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input className='main-input-box' onChange={changeProductPrice} value={productPrice}  placeholder="Unit Price"/>
                </div>
              </div>
              
              <div className="brand-input-box brand-input-box-alt brand-input-box-alt-1 flex flex-row">
                <textarea id="message" rows="4" onChange={changeProductDescription} class="flex p-2 w-full main-input-box rounded-lg" placeholder="Product Description" value={productDescription}></textarea>
              </div>
              <div className="w-96 flex flex-col">
                <div className="flex flex-row space-x-2">
                  <h1 className="table-heading">Select Category *</h1> 
                </div>
                
                <Combobox value={selected} onChange={setSelected}>
                  <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(listedCategories) => listedCategories.name}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>

                      </Combobox.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery('')}
                    >
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                        {filteredCategories.length === 0 && query !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredCategories.map((category) => (
                            <Combobox.Option
                              key={category.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                }`
                              }
                              value={category}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {category.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-teal-600'
                                      }`}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-color">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>

                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </div>
              <button onClick={submitProductRecord} className="brand-button cursor-pointer">
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
            
          </div>
        </div>
      </div>
    </>
  )
}
const useExtraUtil = () => {

  const getDateString = (value) => {
    const dateObj = new Date(value);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate
  }

  const getElemenetStatus = (e) => {
    if (e){
      return 'Active'
    }else{
      return 'In-active'
    }
  }

  return {getDateString, getElemenetStatus}
}

export default useExtraUtil;
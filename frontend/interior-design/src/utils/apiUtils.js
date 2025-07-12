import Cookies from 'js-cookie';

export const fetchCategories = async () => {
  const token = Cookies.get('token');
  const response = await fetch('http://localhost:5029/api/v1/Categories', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  return response.ok ? (result.data || result) : [];
};

export const createProduct = async (payload) => {
  const token = Cookies.get('token');
  const response = await fetch('http://localhost:5029/api/v1/Products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.[0]?.description || 'Failed to add product.');
  }
  
  return response.json();
};

export const generateInpaintImage = async (formData) => {
  console.log(formData.values);
  const token = Cookies.get('token');
  const response = await fetch('http://localhost:5029/api/v1/ImageProcess/inpaint', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Failed to generate customized image');
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to generate customized image');
    }
  }
  
  return response.blob();
};
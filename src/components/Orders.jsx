import React from 'react'

function Orders() {


  return (
    <>
    <div className="w-1/2 text-black mx-auto mt-16 p-7 px-10 rounded shadow mb-40 bg-footer">
        <h2 className="text-whitetext-3xl font-semibold mb-10">Create A Job</h2>
        <form 
        onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-600">
              Customer Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
            //   value={formData.title}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-600">
              Customer Phone Number
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
            //   value={formData.companyName}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Phone Model
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Repair Problem
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
                  
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              repair description
            </label>
            <textarea
              id="description"
              name="description"
            //   value={formData.description}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Imei number
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Model Number
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Phone condition
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-600">
            </label>
            Sim tray
            <select
              id="job_type"
              name="job_type"
            //   value={formData.job_type}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select Sim tray
              </option>
              <option value="full-time">Present</option>
              <option value="part-time">Absent</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-600">
            </label>
            SD card
            <select
              id="job_type"
              name="job_type"
            //   value={formData.job_type}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select SD card
              </option>
              <option value="full-time">Present</option>
              <option value="part-time">Absent</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-600">
            </label>
            phone cover
            <select
              id="job_type"
              name="job_type"
            //   value={formData.job_type}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select cover
              </option>
              <option value="full-time">Present</option>
              <option value="part-time">Absent</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Total Amount
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Advance paid
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Due
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deadline_date" className="block text-sm font-medium text-gray-600">
              received date
            </label>
            <input
              type="date"
              id="deadline_date"
              name="deadline_date"
            //   value={formData.deadline_date}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deadline_date" className="block text-sm font-medium text-gray-600">
              delivery date
            </label>
            <input
              type="date"
              id="deadline_date"
              name="deadline_date"
            //   value={formData.deadline_date}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              received by
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              repaired by
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
            //   value={formData.tags}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-600">
            </label>
            Status
            <select
              id="job_type"
              name="job_type"
            //   value={formData.job_type}
            //   onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="full-time">repaired</option>
              <option value="part-time">not repaired</option>
            </select>
          </div>
        
        

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>
    </>
  )
}

export default Orders
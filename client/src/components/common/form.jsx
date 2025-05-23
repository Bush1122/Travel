import React from "react";
import { motion } from "framer-motion";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

import { Button } from "@/components/ui/button";

function Commonform({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  function renderInputByComponentType(controlItem) {
    let element = null;
    const value = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [controlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0 ? (
                controlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No options available</SelectItem> // Fallback in case no options are provided
              )}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            rows="4" // Example of 4 rows, you can adjust this based on need
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          />
        );
        break;
      default:
        element = (
          <input
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <>
      <form className="max-w-lg p-4 mx-auto space-y-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          {formControls.map((controlItem) => (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <label
                className="mb-1 text-sm font-semibold text-gray-700"
                htmlFor={controlItem.name}
              >
                {controlItem.label}
              </label>
              {renderInputByComponentType(controlItem)}
            </div>
          ))}
        </div>

        <div className="mt-5 text-center justify-items-center">
          <motion.button
            type="submit"
            className="w-full py-2 text-white transition duration-200 bg-gray-950"
            whileHover={{ scale: 1.05 }}
          >
            {buttonText}
          </motion.button>
        </div>
      </form>
    </>
  );
}

export default Commonform;

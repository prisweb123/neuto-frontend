import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ManualProduct } from "./type";

export default function AddProductManually({
  products,
  setProducts,
}: {
  products: ManualProduct[];
  setProducts: React.Dispatch<React.SetStateAction<ManualProduct[]>>;
}) {
  const [formData, setFormData] = useState<ManualProduct>({
    name: "",
    price: 0,
    description: "",
    discount: 0,
    vat: 0,
    totalPrice: 0,
  });

  const calculateTotalPrice = (
    price: number,
    discount: number,
    vat: number
  ) => {
    const discountedPrice = price - discount;
    const vatAmount = discountedPrice * (vat / 100);
    return discountedPrice + vatAmount;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let numericValue = value;

    if (name === "price" || name === "discount") {
      numericValue = value.replace(/[^0-9]/g, "");
    }

    const updatedFormData = {
      ...formData,
      [name]:
        name === "vat"
          ? parseInt(value) || 0
          : name === "price" || name === "discount"
          ? parseInt(numericValue) || 0
          : value,
    };

    const totalPrice = calculateTotalPrice(
      updatedFormData.price,
      updatedFormData.discount,
      updatedFormData.vat
    );

    setFormData({ ...updatedFormData, totalPrice });
  };

  const [error, setError] = useState<string>("");

  const validateForm = () => {
    let newError = "";
    if (!formData.name || !formData.price) {
      newError = "Product name and price are required";
    } else if (formData.discount > formData.price) {
      newError = "Discount cannot be greater than price";
    } else {
      newError = "";
    }
    setError(newError);
    return newError;
  };

  const handleAddProduct = () => {
    if (validateForm()) return;

    setProducts([...products, formData]);
    setFormData({
      name: "",
      price: 0,
      description: "",
      discount: 0,
      vat: 0,
      totalPrice: 0,
    });
  };
  const totalAmount = products.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-teal-600 mb-4">
        Legg til manuelt tjeneste/vare
      </h3>

      {products.length > 0 && (
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Tjeneste/Vare
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Pris
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Avslag
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Mva
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Totalt
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString()}.00,-
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.discount.toLocaleString()}.00,-
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.vat}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.totalPrice.toLocaleString()}.00,-
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => {
                          const updatedProducts = [...products];
                          updatedProducts.splice(index, 1);
                          setProducts(updatedProducts);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Slett
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                  >
                    Total Amount:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {totalAmount.toLocaleString()},00,-
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50/80 rounded-lg border border-blue-100 p-6">
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tjeneste/Vare
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder=""
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pris
            </label>
            <input
              type="text"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              placeholder=""
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beskrivelse
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder=""
            rows={3}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avslag
            </label>
            <input
              type="text"
              name="discount"
              value={formData.discount || ""}
              onChange={handleInputChange}
              placeholder=""
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mva
            </label>
            <div className="relative">
              <select
                name="vat"
                value={formData.vat}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 bg-white text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 appearance-none"
              >
                <option value="0">Velg sats</option>
                <option value="25">25%</option>
                <option value="15">15%</option>
                <option value="0">0%</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Total pris inkl. MVA


            </label>
            <input
              type="text"
              value={`${formData.totalPrice.toLocaleString()},00,-`}
              readOnly
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-blue-100/50 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAddProduct}
            className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Legg til
          </button>
        </div>
      </div>
    </div>
  );
}

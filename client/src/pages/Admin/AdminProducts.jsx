import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ADDEDIT_MODES = {
  ADD: "add",
  EDIT: "edit",
};

export const AdminProducts = () => {
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [addEditMode, setAddEditMode] = useState(null);
  const [editing, setEditing] = useState(null);
  const {
    getProductsQuery,
    addProductMutation,
    editProductMutation,
    deleteProductMutation,
  } = useProducts();
  const { categoriesQuery } = useCategories();
  const { data: categoriesResponse } = categoriesQuery;
  const categories = categoriesResponse?.data?.categories;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data: response, isLoading } = getProductsQuery(
    page,
    9,
    search,
    categoryId,
  );
  const products = response?.data?.products;
  const dialogRef = useRef();
  const deleteRef = useRef();
  const [deleting, setDeleting] = useState(null);
  const onSubmit = (productForm) => {
    const payload = { ...productForm, image: productForm.image[0] };
    if (addEditMode === ADDEDIT_MODES.ADD) {
      setEditing(null);
      addProductMutation.mutate(payload, {
        onSuccess: () => {
          dialogRef.current.close();
          toast.success("Product added");
          reset({ name: "", description: "", price: "", image: "" });
        },
      });
    } else {
      editProductMutation.mutate(
        {
          productId: editing.id,
          productForm: payload,
        },
        {
          onSuccess: () => {
            toast.success("Product edited successfully");
            dialogRef.current.close();
          },
          onError: () => {
            toast.error("Product edit failed");
          },
        },
      );
    }
  };

  return (
    <div className="container d-flex flex-column gap-3 min-vh-100 mb-5">
      <h3 className="my-4 text-center ">Products</h3>
      <div className="d-flex justify-content-between">
        <i
          className="bi bi-chevron-left btn"
          onClick={() => {
            navigate("/admin/dashboard");
          }}
        >
          Back
        </i>
        <button
          className="align-self-end btn btn-sm bg-dark text-light"
          onClick={() => {
            setAddEditMode(ADDEDIT_MODES.ADD);
            dialogRef.current.showModal();
            setEditing(null);
            reset({
              name: "",
              description: "",
              price: "",
              image: "",
              inStock: "",
              categoryId: "",
            });
          }}
        >
          Add Product
        </button>
      </div>
      <section className="d-flex flex-column gap-3 flex-md-row justify-content-md-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          className="form-control product-search"
          placeholder="Search a product name...."
        />
        <select
          className="form-select product-dropdown"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Choose a category</option>
          {categories?.map((item) => (
            <option key={item?.id} value={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </section>
      {isLoading ? (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <span className="spinner-border"></span>
        </div>
      ) : products?.length < 1 ? (
        <div className="text-center my-5">
          <span>
            No product matching your search, please try somehting else{" "}
          </span>
        </div>
      ) : (
        <div className="row g-3 flex-grow-1">
          {products?.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card">
                <img
                  className="w-100 rounded-top"
                  src={item?.image}
                  alt={item?.name}
                  style={{ width: "300px", height: "300px" }}
                />
                <div className="px-3 d-flex flex-column gap-2">
                  <span className="fw-bold text-secondary">
                    {item?.category?.name}
                  </span>
                  <span className="fw-bold">{item?.name}</span>
                  <span className="fw-bold">
                    ₦{Number(item?.price).toLocaleString()}
                  </span>
                  <hr />
                  <div className="d-flex gap-3 mb-3">
                    <button
                      className="btn bg-dark text-light w-100 btn-sm"
                      onClick={() => {
                        setAddEditMode(ADDEDIT_MODES.EDIT);
                        dialogRef.current.showModal();
                        setEditing(item);
                        reset(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      disabled={deleteProductMutation.isPending}
                      className={`btn btn-outline-danger w-100 btn-sm `}
                      onClick={() => {
                        setDeleting(item?.id);
                        deleteRef.current.showModal();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {products?.length > 0 && (
        <span className="align-self-end d-flex align-items-center">
          <i
            className="bi bi-chevron-left btn btn-sm"
            onClick={() => {
              setPage((current) => (current > 1 ? current - 1 : current));
            }}
          ></i>
          <span>
            {page} of {response?.data?.totalPages}
          </span>
          <i
            className="bi bi-chevron-right btn btn-sm"
            onClick={() => {
              setPage((current) =>
                current < response?.data?.totalPages ? current + 1 : current,
              );
            }}
          ></i>
        </span>
      )}
      <dialog ref={dialogRef} className="add-edit-modal rounded">
        <div>
          <div className="d-flex justify-content-between  align-items-center">
            <h5>
              {addEditMode === ADDEDIT_MODES.ADD
                ? "Add product"
                : "Edit Product"}
            </h5>
            <i
              className="bi bi-x fs-4 cursor-pointer"
              onClick={() => {
                dialogRef.current.close();
                setEditing(null);
              }}
            ></i>
          </div>
          <form
            className="d-flex flex-column gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="d-flex justify-content-between">
                <label
                  htmlFor="productImage"
                  className="fw-bold text-secondary"
                >
                  Image
                </label>
                {errors?.image && (
                  <span className="add-edit-form-error">
                    {errors.image.message}
                  </span>
                )}
              </div>
              <input
                {...register("image", {
                  required:
                    addEditMode === ADDEDIT_MODES.ADD
                      ? "Image is required"
                      : false,
                })}
                type="file"
                id="productImage"
                accept="image/*"
                className="form-control"
              />
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <label htmlFor="name" className="fw-bold text-secondary">
                  Name
                </label>
                {errors?.name && (
                  <span className="add-edit-form-error">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <input
                type="text"
                id="name"
                className="form-control"
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <label htmlFor="description" className="fw-bold text-secondary">
                  Description
                </label>
                {errors?.description && (
                  <span className="add-edit-form-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                id="description"
                className="form-control"
              ></textarea>
            </div>
            <div className="d-flex gap-3">
              <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between">
                  <label htmlFor="price" className="fw-bold text-secondary">
                    Price
                  </label>
                  {errors?.price && (
                    <span className="add-edit-form-error">
                      {errors.price.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  id="price"
                  className="form-control"
                ></input>
              </div>{" "}
              <div className="d-flex flex-column w-100">
                {" "}
                <div className="d-flex justify-content-between">
                  <label htmlFor="in-stock" className="fw-bold text-secondary">
                    Instock
                  </label>
                  {errors?.inStock && (
                    <span className="add-edit-form-error">
                      {errors.inStock.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("inStock", {
                    required: "In stock is required",
                    min: { value: 0, message: "In stock must be positive" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  id="in-stock"
                  className="form-control"
                ></input>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between">
                <label htmlFor="categoryId" className="fw-bold text-secondary">
                  Category
                </label>
                {errors?.categoryId && (
                  <span className="add-edit-form-error">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>
              <select
                id="categoryId"
                className="form-select"
                {...register("categoryId", {
                  required: "Category is required",
                })}
              >
                <option value="">Choose a category</option>
                {categories?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-3 my-3 align-self-end w-50">
              <button
                disabled={
                  addProductMutation.isPending || editProductMutation.isPending
                }
                className={`btn  text-light w-100 btn-sm align-self-end ${editProductMutation.isPending || addProductMutation.isPending ? "bg-secondary" : "bg-dark"}`}
              >
                {addProductMutation.isPending
                  ? "Adding product..."
                  : editProductMutation.isPending
                    ? "Editing product..."
                    : addEditMode === ADDEDIT_MODES.ADD
                      ? "Add Product"
                      : "Edit Product"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <dialog ref={deleteRef} className="rounded">
        <div className="p-3 d-flex flex-column gap-3">
          <span>Are you sure you want to delete this product ?</span>
          <div className="d-flex gap-3">
            <button
              className={`btn btn-sm w-100  text-light ${deleteProductMutation.isPending ? "bg-secondary" : "bg-dark"}`}
              onClick={() => {
                deleteProductMutation.mutate(deleting, {
                  onSuccess: () => {
                    toast.success("Product deleted");
                    deleteRef.current.close();
                  },
                });
              }}
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Yes"}
            </button>
            <button
              className="btn btn-sm btn-outline-danger w-100"
              onClick={() => {
                deleteRef.current.close();
              }}
            >
              No
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

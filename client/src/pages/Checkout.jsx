import { useForm } from "react-hook-form";
import { nigerianStates } from "../data/states";
import { usePayment } from "../hooks/usePayment";

export const Checkout = () => {
  const { initializePaymentMutation } = usePayment();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (checkoutForm) => {
    console.log(checkoutForm);
    initializePaymentMutation.mutate(checkoutForm, {
      onSuccess: (data) => {
        window.location.href = data?.data?.authorization_url;
      },
    });
  };
  return (
    <div className="container text-uppercase d-flex flex-column justify-content-center align-items-center  pb-5">
      <h4 className="my-4">Checkout</h4>
      <div className="card p-3 checkout-section ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column gap-4">
            {" "}
            <section className="card p-3 w-100 d-flex flex-column gap-2">
              <h5>Contact Information</h5>

              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="firstName" className="fw-bold text-secondary">
                    first name
                  </label>
                  {errors.firstName && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.firstName?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  id="firstName"
                  type="text"
                  className={`form-control ${errors.firstName ? "border-danger" : ""}`}
                  placeholder="FIRST NAME"
                />
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="lastName" className="fw-bold text-secondary">
                    last name
                  </label>
                  {errors.lastName && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.lastName?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  id="lastName"
                  type="text"
                  className={`form-control ${errors.lastName ? "border-danger" : ""}`}
                  placeholder="LAST NAME"
                />
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <label
                    htmlFor="phoneNumber"
                    className="fw-bold text-secondary"
                  >
                    phone number
                  </label>{" "}
                  {errors.phone && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.phone?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "Phone number must be 11 digits",
                    },
                  })}
                  className={`form-control ${errors.phone ? "border-danger" : ""}`}
                  id="phoneNumber"
                  type="tel"
                  placeholder="PHONE NUMBER"
                />
              </div>
              <div className="d-flex flex-column">
                {" "}
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="email" className="fw-bold text-secondary">
                    email
                  </label>{" "}
                  {errors.email && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.email?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className={`form-control ${errors.email ? "border-danger" : ""}`}
                  id="email"
                  type="email"
                  placeholder="EMAIL"
                />
              </div>
            </section>
            <section className="card p-3 w-100 d-flex flex-column gap-2">
              <h5>Shipping Address</h5>
              <div className="d-flex flex-column">
                {" "}
                <div className="d-flex justify-content-between align-items-center">
                  <label
                    htmlFor="streetAddress"
                    className="fw-bold text-secondary"
                  >
                    street address
                  </label>
                  {errors.streetAddress && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.streetAddress?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("streetAddress", {
                    required: "Street Address is required",
                  })}
                  className={`form-control ${errors.streetAddress ? "border-danger" : ""}`}
                  id="streetAddress"
                  type="text"
                  placeholder="STREET ADDRESS"
                />
              </div>
              <div className="d-flex flex-column">
                <label className="fw-bold text-secondary">Country</label>
                <span className="form-control">Nigeria</span>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="state" className="fw-bold text-secondary">
                    state
                  </label>{" "}
                  {errors.state && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.state?.message}
                    </span>
                  )}
                </div>
                <select
                  id="state"
                  {...register("state", {
                    required: "State is required",
                  })}
                  className={`form-select ${errors.state ? "border-danger" : ""}`}
                >
                  <option value="">Choose a state</option>
                  {nigerianStates.map((item) => (
                    <option key={item} className="text-capitalize" value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex flex-column">
                {" "}
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="city" className="fw-bold text-secondary">
                    city
                  </label>{" "}
                  {errors.city && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.city?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("city", {
                    required: "City is required",
                  })}
                  className={`form-control ${errors.city ? "border-danger" : ""}`}
                  id="city"
                  type="text"
                  placeholder="CITY"
                />
              </div>
              <div className="d-flex flex-column">
                {" "}
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="zipcode" className="fw-bold text-secondary">
                    zip code
                  </label>{" "}
                  {errors.zipCode && (
                    <span
                      className="text-danger error-message fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {errors?.zipCode?.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("zipCode", {
                    required: "Zip Code is required",
                  })}
                  className={`form-control ${errors.zipCode ? "border-danger" : ""}`}
                  id="zipcode"
                  type="text"
                  placeholder="ZIP CODE"
                />
              </div>
            </section>{" "}
            <button className="btn bg-dark w-100 text-light ">SUBMIT</button>
          </div>
        </form>
      </div>
    </div>
  );
};

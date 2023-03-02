export default function AuthModal() {
  return (
    <>
      <input type="checkbox" id="auth-modal" className="modal-toggle" />
      <label htmlFor="auth-modal" className="modal">
        <label className="modal-box flex flex-col gap-4 pt-2">
          <div className="flex w-full gap-2">
            <div className="tabs flex-grow">
              <a className="tab tab-bordered tab-active flex-grow">Guest</a>
              <a className="tab tab-bordered tab-disabled flex-grow">Login</a>
              <a className="tab tab-bordered tab-disabled flex-grow">Register</a>
            </div>
            <label htmlFor="auth-modal" className="btn btn-sm btn-circle btn-ghost">
              ✕
            </label>
          </div>

          <div className="flex flex-col">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Update guest name</span>
              </label>
              <label className="input-group">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Enter name here..."
                  className="input input-bordered flex-grow"
                />
              </label>
            </div>
            <div className="modal-action">
              <label htmlFor="auth-modal" className="btn">
                Confirm
              </label>
            </div>
          </div>
        </label>
      </label>
    </>
  );
}

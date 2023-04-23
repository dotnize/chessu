"use client";

export default function Login() {
  return (
    <div className="form-control">
      <label htmlFor="loginName" className="label">
        <span className="label-text">Username or email</span>
      </label>
      <input
        type="text"
        pattern="[A-Za-z0-9]+"
        title="Alphanumeric characters only"
        id="loginName"
        name="loginName"
        placeholder="username"
        className="input input-bordered"
        maxLength={16}
        minLength={2}
        required
      />
      <label htmlFor="loginPassword" className="label">
        <span className="label-text">Password</span>
      </label>
      <input
        type="password"
        id="loginPassword"
        name="loginPassword"
        placeholder="password"
        className="input input-bordered"
        minLength={3}
        required
      />
    </div>
  );
}

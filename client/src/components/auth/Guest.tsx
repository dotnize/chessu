"use client";

export default function Guest({ currentName }: { currentName: string }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Hello, {currentName}!</span>
      </label>
      <label className="input-group">
        <span>Name</span>
        <input
          type="text"
          pattern="[A-Za-z0-9]+"
          title="Alphanumeric characters only"
          id="guestName"
          name="guestName"
          placeholder="Enter name here..."
          className="input input-bordered w-full"
          maxLength={16}
          minLength={2}
          required
        />
      </label>
    </div>
  );
}

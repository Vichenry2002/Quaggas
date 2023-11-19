import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Create() {
    const [form, setForm] = useState({
        user_id: "",
        hashedpswd: "",

    });
    const navigate = useNavigate();
    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPerson = { ...form };
        await fetch("http://localhost:8081/record/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                console.log("co")
                window.alert(error);
                return;
            });
        console.log("form not clearing")
        setForm({ user_id: "", hashedpswd: "" });
        navigate("/");
    }
    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Register User</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="user_id">User ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="user_id"
                        value={form.user_id}
                        onChange={(e) => updateForm({ user_id: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hashedpswd">PassWord</label>
                    <input
                        type="text"
                        className="form-control"
                        id="hashedpswd"
                        value={form.hashedpswd}
                        onChange={(e) => updateForm({ hashedpswd: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Create person"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
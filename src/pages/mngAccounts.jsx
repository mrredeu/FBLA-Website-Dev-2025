import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "../assets/css/mngAccounts.css";

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch all accounts from the API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          "/api/manage-accounts.php?action=getAccounts"
        );
        const data = await response.json();
        setAccounts(data.accounts || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Handle account approval
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/manage-accounts.php?action=approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Account approved successfully!");
        setAccounts((prevAccounts) =>
          prevAccounts.map((acc) =>
            acc.id === id ? { ...acc, is_approved: 1 } : acc
          )
        );
      } else {
        alert("Failed to approve account. Please try again.");
      }
    } catch (error) {
      console.error("Error approving account:", error);
    }
  };

  // Handle account denial
  const handleDeny = async (id) => {
    try {
      const response = await fetch(`/api/manage-accounts.php?action=deny`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Account denied successfully!");
        setAccounts((prevAccounts) =>
          prevAccounts.map((acc) =>
            acc.id === id ? { ...acc, is_approved: -1 } : acc
          )
        );
      } else {
        alert("Failed to deny account. Please try again.");
      }
    } catch (error) {
      console.error("Error denying account:", error);
    }
  };

  // Handle account deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/manage-accounts.php?action=remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Account deleted successfully!");
        setAccounts((prevAccounts) =>
          prevAccounts.filter((acc) => acc.id !== id)
        );
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Filter accounts based on their status
  const filteredAccounts = accounts.filter((account) => {
    if (filter === "all") return true;
    if (filter === "approved") return account.is_approved === 1;
    if (filter === "pending") return account.is_approved === 0;
    if (filter === "denied") return account.is_approved === -1;
    return false;
  });

  return (
    <>
      <Navbar />
      <div className="manage-container">
        <h1>Manage User Accounts</h1>

        {/* Dropdown Filter */}
        <div className="dropdown-filter">
          <label htmlFor="filter">Filter Users:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
          </select>
        </div>

        {/* Account List */}
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <div key={account.id} className="manage-account">
              <h2>{account.full_name}</h2>
              <p>
                <strong>Email:</strong> {account.email}
              </p>
              <p>
                <strong>Role:</strong> {account.role}
              </p>
              {filter === "all" && (
                <p>
                  <strong>Status:</strong>{" "}
                  {account.is_approved === 1
                    ? "Approved"
                    : account.is_approved === 0
                    ? "Pending"
                    : "Denied"}
                </p>
              )}
              <div className="manage-actions">
                {account.is_approved === 0 && (
                  <>
                    <button
                      className="approve"
                      onClick={() => handleApprove(account.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="deny"
                      onClick={() => handleDeny(account.id)}
                    >
                      Deny
                    </button>
                  </>
                )}
                {(account.is_approved === 1 || account.is_approved === -1) && (
                  <button
                    className="delete"
                    onClick={() => handleDelete(account.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No accounts found for this category.</p>
        )}
      </div>
    </>
  );
};

export default ManageAccounts;

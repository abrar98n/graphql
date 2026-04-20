export async function renderProfile(app, renderApp) {

    const token = localStorage.getItem("token");

    const query = `
    {
    user {
        id
        login
    }

    transaction_aggregate(where: { type: { _eq: "xp" } }) {
        aggregate {
        sum {
            amount
        }
        }
    }

level: transaction(
  where: { type: { _eq: "level" } }
  order_by: { amount: desc }
  limit: 1
) {
  amount
}

    auditRatio: transaction_aggregate(where: { type: { _eq: "up" } }) {
        aggregate {
        sum {
            amount
        }
        }
    }

    auditDown: transaction_aggregate(where: { type: { _eq: "down" } }) {
        aggregate {
        sum {
            amount
        }
        }
    }
    }
`;

    let user = null;
    let totalXP= null;
    let level = null;
    let auditUp = null;
    let auditDown = null;
    let auditRatio = null;


    try {
    const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });



    const data = await res.json();
    console.log("GRAPHQL DATA:", data);

    user = data?.data?.user?.[0];
    totalXP = data?.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
    level = data?.data?.level?.[0]?.amount || 0;
    auditUp = data?.data?.auditRatio?.aggregate?.sum?.amount || 0;
    auditDown = data?.data?.auditDown?.aggregate?.sum?.amount || 0;
    auditRatio = auditDown ? (auditUp / auditDown).toFixed(2) : 0;




    } catch (err) {
    console.log("GraphQL error:", err);
    }


  app.innerHTML = `
    <main class="profile-page">
      <section class="profile-shell">
        <header class="profile-header">
          <div class="profile-header-text">
            <h1 class="profile-title">GraphQL Profile</h1>
            <p class="profile-subtitle">You are logged in successfully</p>
          </div>

          <button class="logout-btn" id="logout-btn">Logout</button>
        </header>

        <section class="profile-placeholder">
          <h2>Profile Dashboard</h2>

        <p><strong>User ID:</strong> ${user?.id ?? "N/A"}</p>
        <p><strong>Login:</strong> ${user?.login ?? "N/A"}</p>
        <p><strong>XP:</strong> ${totalXP}</p>
        <p><strong>Level:</strong> ${level}</p>
        <p><strong>Audit Ratio:</strong> ${auditRatio}</p>

        </section>
      </section>
    </main>
  `;

  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    renderApp();
  });
}
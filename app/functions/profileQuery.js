export const PROFILE_QUERY = `
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

  xpTransactions: transaction(
    where: { type: { _eq: "xp" } }
    order_by: { amount: desc }
    limit: 6
  ) {
    amount
    path
  }

  xpTimeline: transaction(
    where: { type: { _eq: "xp" } }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
  }

  skills: transaction(
    where: { type: { _like: "skill_%" } }
    order_by: { amount: desc }
  ) {
    type
    amount
  }
}
`;
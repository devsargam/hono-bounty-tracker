export const extractAmount = (comment: string) => {
  console.log(comment);
  const bountyExtractor = /\/bounty\s+(\$?\d+|\d+\$)/;

  const match = comment.match(bountyExtractor);
  return match ? match[1] : null;
};

export const isBountyComment = (comment: string) => {
  return comment.trim().toLocaleLowerCase().startsWith('/bounty');
};

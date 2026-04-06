exports.validateTaskData = (title) => {
    if (!title || typeof title !== 'string') return false;
    if (title.trim() === '') return false;
    return true;
};

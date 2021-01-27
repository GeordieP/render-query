export const computeLoading = (queries: RenderQueryQueries) => {
  const mut_out: RenderQueryLoadingState = {
    is: false,
    which: [],
  };

  const entries = Object.entries(queries);
  for (const [name, value] of entries) {
    if (!value.isLoading) {
      mut_out.which.push({ name, isLoading: false });
      continue;
    }

    mut_out.is = true;
    mut_out.which.push({ name, isLoading: true });
  }

  return mut_out;
};

export const computeError = (queries: RenderQueryQueries) => {
  const mut_out: RenderQueryErrorState = {
    is: false,
    errors: {},
  };

  const entries = Object.entries(queries);
  for (const [key, value] of entries) {
    if (!value.isError) continue;

    mut_out.is = true;

    if (value.error instanceof Error) {
      mut_out.errors[key] = value.error;
    } else {
      mut_out.errors[key] = new Error(value.error as string); // TODO:HACK: not guaranteed to be string
    }
  }

  return mut_out;
};

export const isFunction = (maybeFunction: any) =>
  ({}.toString.call(maybeFunction) === "[object Function]");

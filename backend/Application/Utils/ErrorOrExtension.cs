using AutoMapper;
using ErrorOr;
using System.Collections.Generic;
using System.Linq;

namespace Application.Utils
{
    public static class ErrorOrExtensions
    {
        public static ErrorOr<IEnumerable<TDest>> MapList<TSource, TDest>(
            this ErrorOr<IEnumerable<TSource>> source,
            IMapper mapper)
        {
            if (source.IsError)
                return source.Errors;

            var mapped = mapper.Map<IEnumerable<TDest>>(source.Value);
            // Use implicit conversion if supported, otherwise wrap explicitly
            return mapped.ToList();
        }
    }
}
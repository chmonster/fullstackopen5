const Blog = ({blog}) => (
  <table style={{width: '50%'}}>
    <tr>
      <td><a href={blog.url} title={blog.title} alt={blog.title}>
        {blog.title}
      </a></td> 
      <td style={{textAlign:'right'}}> {blog.author} </td>
    </tr>
  </table>
)

export default Blog
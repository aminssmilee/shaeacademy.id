<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Shae Academy</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

    @viteReactRefresh
    @vite('resources/js/app.jsx') 
</head>
<body>
    {{-- 
        data-category akan:
        - null / kosong → HomePage
        - muslim → CategoryPage muslim
        - life → CategoryPage life
        - profesional → CategoryPage profesional
    --}}
    <div
        id="root"
        data-category="{{ $category ?? '' }}"
    ></div>
</body>
</html>

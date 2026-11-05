<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInputMiddleware
{
    /**
     * Membersihkan input string dari potensi script tag atau XSS payload.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                // Hapus script tags dan tags yang berpotensi mengeksekusi JS
                $value = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $value);
                // Strip tag berbahaya seperti on*=, iframe, javascript:
                $value = preg_replace('/javascript\s*:/i', '', $value);
                $value = preg_replace('/<\/?(iframe|embed|object|base|link|meta)\b[^>]*>/i', '', $value);
                // Trim spasi tidak teratur
                $value = trim($value);
            }
        });

        $request->merge($input);

        return $next($request);
    }
}

